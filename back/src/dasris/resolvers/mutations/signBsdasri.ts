import { checkIsAuthenticated } from "../../../common/permissions";

import { getBsdasriOrNotFound } from "../../database";
import { expandBsdasriFromDb } from "../../dasri-converter";

import {
  MutationSignBsdasriArgs,
  BsdasriSignatureType,
  MutationResolvers
} from "../../../generated/graphql/types";

import { UserInputError } from "apollo-server-express";
import { InvalidTransition } from "../../../forms/errors";

import { Bsdasri, BsdasriStatus } from "@prisma/client";
import dasriTransition from "../../workflow/dasriTransition";
import { BsdasriEventType } from "../../workflow/types";
import { checkIsCompanyMember } from "../../../users/permissions";

import { getCompanyOrCompanyNotFound } from "../../../companies/database";
import { BsdasriValidationContext } from "../../validation";

const signBsdasri: MutationResolvers["signBsdasri"] = async (
  _,
  { id, signatureInput }: MutationSignBsdasriArgs,
  context
) => {
  const user = checkIsAuthenticated(context);
  const bsdasri = await getBsdasriOrNotFound({ id });
  if (bsdasri.isDraft) {
    throw new InvalidTransition();
  }

  const signatureParams = dasriSignatureMapping[signatureInput.type];

  // Which siret is involved in curent signature process ?
  const siretWhoSigns = signatureParams.authorizedSiret(bsdasri);
  // Is this siret belonging to concrete user ?
  await checkIsCompanyMember({ id: user.id }, { siret: siretWhoSigns });

  await checkEmitterAllowsDirectTakeOver({
    signatureParams,
    bsdasri
  });
  await checkEmitterAllowsSignatureWithSecretCode({
    signatureParams,
    bsdasri,
    securityCode: signatureInput?.securityCode
  });

  const data = {
    [signatureParams.author]: signatureInput.author,
    [signatureParams.date]: new Date(),
    [signatureParams.signatoryField]: { connect: { id: user.id } },
    ...getFieldsUpdate({ bsdasri, signatureInput })
  };

  // Validate required fields are filled

  const updatedDasri = await dasriTransition(
    bsdasri,
    {
      type: signatureParams.eventType,
      dasriUpdateInput: data
    },
    signatureParams.validationContext
  );

  return expandBsdasriFromDb(updatedDasri);
};

export default signBsdasri;

type getFieldsUpdateFn = ({
  bsdasri: Dasri,
  signatureInput: BsdasriSignatureInput
}) => Partial<Bsdasri>;
/**
 
 * A few fields obey to a custom logic
 */
const getFieldsUpdate: getFieldsUpdateFn = ({ bsdasri, signatureInput }) => {
  // on reception signature, fill handedOverToRecipientAt if not already completed
  if (signatureInput.type === "RECEPTION" && !bsdasri.handedOverToRecipientAt) {
    return {
      handedOverToRecipientAt: bsdasri.receivedAt
    };
  }
  return {};
};

type BsdasriSignatureInfos = {
  author:
    | "emissionSignatureAuthor"
    | "transportSignatureAuthor"
    | "receptionSignatureAuthor"
    | "operationSignatureAuthor";
  date:
    | "emissionSignatureDate"
    | "transportSignatureDate"
    | "receptionSignatureDate"
    | "operationSignatureDate";
  eventType: BsdasriEventType;
  authorizedSiret: (bsdasri: Bsdasri) => string;
  validationContext: BsdasriValidationContext;
  signatoryField:
    | "emissionSignatory"
    | "transportSignatory"
    | "receptionSignatory"
    | "operationSignatory";
};

/**
 * Parameters to pass to state machine
 */
const dasriSignatureMapping: Record<
  BsdasriSignatureType,
  BsdasriSignatureInfos
> = {
  EMISSION: {
    author: "emissionSignatureAuthor",
    date: "emissionSignatureDate",
    eventType: BsdasriEventType.SignEmission,
    validationContext: { emissionSignature: true },
    signatoryField: "emissionSignatory",
    authorizedSiret: bsdasri => bsdasri.emitterCompanySiret
  },
  EMISSION_WITH_SECRET_CODE: {
    author: "emissionSignatureAuthor",
    date: "emissionSignatureDate",
    eventType: BsdasriEventType.SignEmissionWithSecretCode,
    validationContext: { emissionSignature: true, transportSignature: true },
    signatoryField: "emissionSignatory",
    authorizedSiret: bsdasri => bsdasri.transporterCompanySiret // transporter can sign with emitter secret code (trs device)
  },
  TRANSPORT: {
    author: "transportSignatureAuthor",
    date: "transportSignatureDate",
    eventType: BsdasriEventType.SignTransport,
    validationContext: { transportSignature: true },

    signatoryField: "transportSignatory",
    authorizedSiret: bsdasri => bsdasri.transporterCompanySiret
  },

  RECEPTION: {
    author: "receptionSignatureAuthor",
    date: "receptionSignatureDate",
    eventType: BsdasriEventType.SignReception,
    validationContext: { receptionSignature: true },
    signatoryField: "receptionSignatory",
    authorizedSiret: bsdasri => bsdasri.recipientCompanySiret
  },
  OPERATION: {
    author: "operationSignatureAuthor", // changeme
    date: "operationSignatureDate",
    eventType: BsdasriEventType.SignOperation,
    validationContext: { operationSignature: true },
    signatoryField: "operationSignatory",
    authorizedSiret: bsdasri => bsdasri.recipientCompanySiret
  }
};

type checkEmitterAllowsDirectTakeOverFn = ({
  signatureParams: BsdasriSignatureInfos,
  bsdasri: Bsdasri
}) => Promise<void>;
/**
 * Dasri can be taken over author transporter without signature if emitter explicitly allows this in company preferences
 * Checking this in mutation code needs less code than doing it in the state machine, hence this utils
 */
const checkEmitterAllowsDirectTakeOver: checkEmitterAllowsDirectTakeOverFn = async ({
  signatureParams,
  bsdasri
}) => {
  if (
    signatureParams.eventType === BsdasriEventType.SignTransport &&
    bsdasri.status === BsdasriStatus.INITIAL
  ) {
    const emitterCompany = await getCompanyOrCompanyNotFound({
      siret: bsdasri.emitterCompanySiret
    });
    if (!emitterCompany.allowDasriTakeOverWithoutSignature) {
      throw new UserInputError(
        "Erreur, l'émetteur n'a pas autorisé l'emport par le transporteur sans l'avoir préalablement signé"
      );
    }
  }
};

type checkEmitterAllowsSignatureWithCodeFn = ({
  signatureParams: BsdasriSignatureInfos,
  bsdasri: Dasri,
  securityCode: number
}) => Promise<void>;
/**
 * Dasri takeOver can be processed on the transporter device
 * To perform this, we expect a SEALED -> READY_TO_TAKEOVER signature, then a READY_TO_TAKEOVER -> SENT one
 * This function is intended to perform checks to allow the first aforementionned transition, and verify
 * provided code matches emitter one
 */
const checkEmitterAllowsSignatureWithSecretCode: checkEmitterAllowsSignatureWithCodeFn = async ({
  signatureParams,
  bsdasri,
  securityCode
}) => {
  if (
    signatureParams.eventType !== BsdasriEventType.SignEmissionWithSecretCode ||
    bsdasri.status !== BsdasriStatus.INITIAL
  ) {
    return;
  }
  const emitterCompany = await getCompanyOrCompanyNotFound({
    siret: bsdasri.emitterCompanySiret
  });

  if (!securityCode || securityCode !== emitterCompany.securityCode) {
    throw new UserInputError(
      "Erreur, le code de sécurité est manquant ou invalide"
    );
  }
};
