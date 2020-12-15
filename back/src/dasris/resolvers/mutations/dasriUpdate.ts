import { expandDasriFromDb, flattenDasriInput } from "../../dasri-converter";
import { Prisma } from "@prisma/client";
import prisma from "src/prisma";
import {
  ResolversParentTypes,
  MutationDasriUpdateArgs
} from "../../../generated/graphql/types";
import { WASTES_CODES } from "../../../common/constants";
import { checkIsAuthenticated } from "../../../common/permissions";
 
import { GraphQLContext } from "../../../types";
import { getDasriOrDasriNotFound } from "../../database";
import { draftDasriSchema } from "../../validation";
import { UserInputError } from "apollo-server-express";

// function validateArgs(args: MutationDasriUpdateArgs) {
//   const wasteDetailsCode = args.updateFormInput.wasteDetails?.code;
//   if (wasteDetailsCode && !WASTES_CODES.includes(wasteDetailsCode)) {
//     throw new InvalidWasteCode(wasteDetailsCode);
//   }
//   return args;
// }

const dasriUpdateResolver = async (
  parent: ResolversParentTypes["Mutation"],
  args: MutationDasriUpdateArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const { dasriUpdateInput } = { ...args };

  const { id, ...dasriContent } = dasriUpdateInput;

  const existingDasri = await getDasriOrDasriNotFound({ id });

  // await checkCanReadUpdateDeleteForm(user, existingForm);

  if (existingDasri.status != "DRAFT") {
    const errMessage = "Seuls les dasri en brouillon peuvent être modifiés";
    throw new UserInputError(errMessage);
  }

  const flattened = flattenDasriInput(dasriContent);

  // Validate form input
  await draftDasriSchema.validate(dasriUpdateInput);

  const updatedDasri = await prisma.dasri.update({
    where: { id },
    data: flattened
  });
  return expandDasriFromDb(updatedDasri);
};

export default dasriUpdateResolver;
