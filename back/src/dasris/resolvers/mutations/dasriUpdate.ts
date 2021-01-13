import { expandDasriFromDb, flattenDasriInput } from "../../dasri-converter";
import { Dasri, DasriStatus } from "@prisma/client";
import prisma from "src/prisma";
import {
  ResolversParentTypes,
  MutationDasriUpdateArgs
} from "../../../generated/graphql/types";

import { checkIsAuthenticated } from "../../../common/permissions";
import { checkCanUpdateDasri } from "../../permissions";

import { GraphQLContext } from "../../../types";
import { getDasriOrDasriNotFound } from "../../database";
import { dasriDraftSchema } from "../../validation";
import { UserInputError } from "apollo-server-express";

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
    "receivedAt"
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
    "transporterSignedAt"
  ]
);

const getFieldsAllorwedForUpdate = (dasri: Dasri) => {
  const allowedFields = {
    [DasriStatus.READY_FOR_TAKEOVER]: fieldsAllowedForUpdateOnceSignedByEmitter,
    [DasriStatus.SENT]: fieldsAllowedForUpdateOnceSent,
    [DasriStatus.RECEIVED]: fieldsAllowedForUpdateOnceReceived,
    [DasriStatus.PROCESSED]: []
  };
  return allowedFields[dasri.status];
};

const dasriUpdateResolver = async (
  parent: ResolversParentTypes["Mutation"],
  args: MutationDasriUpdateArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const { dasriUpdateInput } = { ...args };

  const { id, ...dasriContent } = dasriUpdateInput;

  const existingDasri = await getDasriOrDasriNotFound({ id });

  await checkCanUpdateDasri(user, existingDasri);

  const flattened = flattenDasriInput(dasriContent);

  // Validate form input
  await dasriDraftSchema.validate(dasriUpdateInput);

  const flattenedFields = Object.keys(flattened);
  // console.log(flattened)
  // except for draft and sealed status, update fields are whitelisted
  if (!["DRAFT", "SEALED"].includes(existingDasri.status)) {
    const allowedFields = getFieldsAllorwedForUpdate(existingDasri);

    const diff = flattenedFields.filter(el => !allowedFields.includes(el));
    if (!!diff.length) {
      const errMessage = `Les champs suivants ne peuvent plus être modifiés: ${diff.join()}`;
      throw new UserInputError(errMessage);
    }
  }
  console.log(
    ["REFUSED", "PARTIALLY_REFUSED"].includes(
      flattened.transporterWasteAcceptationStatus
    )
  );
  const updatedDasri = await prisma.dasri.update({
    where: { id },
    data: flattened
  });
  return expandDasriFromDb(updatedDasri);
};

export default dasriUpdateResolver;
