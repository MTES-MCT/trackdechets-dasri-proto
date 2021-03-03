import { expandBsdasriFromDb } from "../../dasri-converter";
import { UserInputError } from "apollo-server-express";
import { MissingIdOrReadableId } from "../../errors";
import { QueryResolvers } from "../../../generated/graphql/types";
import { checkIsAuthenticated } from "../../../common/permissions";
import { getBsdasriOrNotFound } from "../../database";
import { checkCanReadBsdasri } from "../../permissions";

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

const bsdasriResolver: QueryResolvers["bsdasri"] = async (_, args, context) => {
  // check query level permissions
  const user = checkIsAuthenticated(context);

  const validArgs = validateArgs(args);

  const bsdasri = await getBsdasriOrNotFound(validArgs);

  await checkCanReadBsdasri(user, bsdasri);
  return expandBsdasriFromDb(bsdasri);
};

export default bsdasriResolver;
