import { expandDasriFormFromDb } from "../../form-converter";
import { UserInputError } from "apollo-server-express";
import { MissingIdOrReadableId } from "../../errors";
import { QueryResolvers } from "../../../generated/graphql/types";

import { getDasriOrDasriNotFound } from "../../database";

function validateArgs(args: any) {
  if (args.id == null && args.readableId == null) {
    throw new MissingIdOrReadableId();
  }
  if (args.id && args.readableId) {
    throw new UserInputError(
      "Vous devez préciser soit un id soit un readableId mais pas les deux"
    );
  }
  return args;
}

const formResolver: QueryResolvers["dasriForm"] = async (_, args, context) => {
  // check query level permissions

  const validArgs = validateArgs(args);

  const form = await getDasriOrDasriNotFound(validArgs);

  return expandDasriFormFromDb(form);
};

export default formResolver;
