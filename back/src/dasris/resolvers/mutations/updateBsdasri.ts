import {
  expandBsdasriFromDb,
  flattenBsdasriInput
} from "../../dasri-converter";
import { Bsdasri, BsdasriStatus } from "@prisma/client";
import prisma from "../../../prisma";
import {
  ResolversParentTypes,
  MutationUpdateBsdasriArgs
} from "../../../generated/graphql/types";

import { checkIsAuthenticated } from "../../../common/permissions";
import { checkIsBsdasriContributor } from "../../permissions";

import { GraphQLContext } from "../../../types";
import { getBsdasriOrNotFound } from "../../database";
import { dasriDraftSchema } from "../../validation";
import { ForbiddenError } from "apollo-server-express";

const fieldsAllowedForUpdateOnceReceived = [
  "processingOperation",
  "processedAt"
];

const fieldsAllowedForUpdateOnceSent = fieldsAllowedForUpdateOnceReceived.concat(
  [
    "recipientCompanyName",
    "recipientCompanySiret",
    "recipientCompanyAddress",
    "recipientCompanyContact",
    "recipientCompanyPhone",
    "recipientCompanyMail",
    "recipientWastePackagingsInfo",
    "recipientWasteAcceptationStatus",
    "recipientWasteRefusalReason",
    "recipientWasteRefusedQuantity",
    "recipientWasteQuantity",
    "recipientWasteVolume",
    "receivedAt",
    "handedOverToRecipientAt",
    "recipientCustomInfo"
  ]
);
const fieldsAllowedForUpdateOnceSignedByEmitter = fieldsAllowedForUpdateOnceSent.concat(
  [
    "transporterCompanyName",
    "transporterCompanySiret",
    "transporterCompanyAddress",
    "transporterCompanyPhone",
    "transporterCompanyContact",
    "transporterCompanyMail",
    "transporterReceipt",
    "transporterReceiptDepartment",
    "transporterReceiptValidityLimit",
    "transporterWasteAcceptationStatus",
    "transporterWasteRefusalReason",
    "transporterWasteRefusedQuantity",
    "transporterTakenOverAt",
    "transporterWastePackagingsInfo",
    "transporterWasteQuantity",
    "transporterWasteQuantityType",
    "transporterWasteVolume",
    "handedOverToRecipientAt",
    "transporterSignedBy",
    "transporterSignedAt",
    "transporterCustomInfo"
  ]
);

const getFieldsAllorwedForUpdate = (bsdasri: Bsdasri) => {
  const allowedFields = {
    [BsdasriStatus.SIGNED_BY_PRODUCER]: fieldsAllowedForUpdateOnceSignedByEmitter,
    [BsdasriStatus.SENT]: fieldsAllowedForUpdateOnceSent,
    [BsdasriStatus.RECEIVED]: fieldsAllowedForUpdateOnceReceived,
    [BsdasriStatus.PROCESSED]: []
  };
  return allowedFields[bsdasri.status];
};

const dasriUpdateResolver = async (
  parent: ResolversParentTypes["Mutation"],
  args: MutationUpdateBsdasriArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const { bsdasriUpdateInput } = { ...args };

  const { regroupedBsdasris, id, ...dasriContent } = bsdasriUpdateInput;

  const existingDasri = await getBsdasriOrNotFound({ id });

  await checkIsBsdasriContributor(
    user,
    existingDasri,
    "Vous ne pouvez pas modifier un bordereau sur lequel votre entreprise n'apparait pas"
  );

  if (["PROCESSED", "REFUSED"].includes(existingDasri.status)) {
    throw new ForbiddenError("Ce bordereau n'est plus modifiable");
  }

  const flattened = flattenBsdasriInput(dasriContent);

  // Validate form input
  await dasriDraftSchema.validate(bsdasriUpdateInput);

  const flattenedFields = Object.keys(flattened);

  // except for draft and sealed status, update fields are whitelisted
  if (existingDasri.status !== "INITIAL") {
    const allowedFields = getFieldsAllorwedForUpdate(existingDasri);

    const diff = flattenedFields.filter(el => !allowedFields.includes(el));

    if (!!diff.length) {
      const errMessage = `Des champs ont été verrouillés via signature et ne peuvent plus être modifiés: ${diff.join()}`;
      throw new ForbiddenError(errMessage);
    }
  }

  const updatedDasri = await prisma.bsdasri.update({
    where: { id },
    data: { ...flattened, regroupedBsdasris: { connect: regroupedBsdasris } }
  });
  return expandBsdasriFromDb(updatedDasri);
};

export default dasriUpdateResolver;
