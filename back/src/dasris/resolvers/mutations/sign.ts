import { checkIsAuthenticated } from "../../../common/permissions";
import { getBsdasriOrNotFound } from "../../database";
import { expandBsdasriFromDb } from "../../dasri-converter";
import { InvalidTransition } from "../../../forms/errors";
import { BsdasriStatus } from "@prisma/client";
import { BsdasriEventType } from "../../workflow/types";

import dasriTransition from "../../workflow/dasriTransition";

import { checkIsCompanyMember } from "../../../users/permissions";
import {
  dasriSignatureMapping,
  checkEmitterAllowsDirectTakeOver,
  checkEmitterAllowsSignatureWithSecretCode,
  getFieldsUpdate
} from "./signatureUtils";

const basesign = async ({
  id,
  signatureInput,
  context,
  securityCode = null
}) => {
  const user = checkIsAuthenticated(context);
  const bsdasri = await getBsdasriOrNotFound({ id });
  if (bsdasri.isDraft) {
    throw new InvalidTransition();
  }
  const signatureType = securityCode
    ? "EMISSION_WITH_SECRET_CODE"
    : signatureInput.type;
  const signatureParams = dasriSignatureMapping[signatureType];
 
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
    securityCode
  });

  const data = {
    [signatureParams.author]: signatureInput.author,
    [signatureParams.date]: new Date(),
    [signatureParams.signatoryField]: { connect: { id: user.id } },
    ...getFieldsUpdate({ bsdasri, signatureInput })
  };

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

export default basesign;
