import { getCompanyOrCompanyNotFound } from "../../../companies/database";
import { BsdasriValidationContext } from "../../validation";

import { BsdasriSignatureType } from "../../../generated/graphql/types";
import { UserInputError } from "apollo-server-express";
import { Bsdasri, BsdasriStatus } from "@prisma/client";

import { BsdasriEventType } from "../../workflow/types";
type checkEmitterAllowsDirectTakeOverFn = ({
  signatureParams: BsdasriSignatureInfos,
  bsdasri: Bsdasri
}) => Promise<void>;
/**
 * Dasri can be taken over author transporter without signature if emitter explicitly allows this in company preferences
 * Checking this in mutation code needs less code than doing it in the state machine, hence this utils
 */
export const checkEmitterAllowsDirectTakeOver: checkEmitterAllowsDirectTakeOverFn = async ({
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
export const checkEmitterAllowsSignatureWithSecretCode: checkEmitterAllowsSignatureWithCodeFn = async ({
  signatureParams,
  bsdasri,
  securityCode
}) => {
  if (!securityCode) {
    return;
  }
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

/**
 * Parameters to pass to state machine
 */
export const dasriSignatureMapping: Record<
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
    validationContext: { emissionSignature: true },
    signatoryField: "emissionSignatory",
    authorizedSiret: bsdasri => bsdasri.transporterCompanySiret // transporter can sign with emitter secret code (trs device)
  },
  TRANSPORT: {
    author: "transportSignatureAuthor",
    date: "transportSignatureDate",
    eventType: BsdasriEventType.SignTransport,
    validationContext: { emissionSignature: true, transportSignature: true }, // validate emission in case of direct takeover

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

type getFieldsUpdateFn = ({
  bsdasri: Dasri,
  signatureInput: BsdasriSignatureInput
}) => Partial<Bsdasri>;

/**
 * A few fields obey to a custom logic
 */
export const getFieldsUpdate: getFieldsUpdateFn = ({
  bsdasri,
  signatureInput
}) => {
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
