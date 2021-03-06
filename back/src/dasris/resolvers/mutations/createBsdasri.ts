import prisma from "../../../prisma";
import {
  MutationCreateBsdasriArgs,
  ResolversParentTypes
} from "../../../generated/graphql/types";
import { GraphQLContext } from "../../../types";
import {
  expandBsdasriFromDb,
  flattenBsdasriInput
} from "../../dasri-converter";
import getReadableId, { ReadableIdPrefix } from "../../../common/readableId";
import { checkIsAuthenticated } from "../../../common/permissions";
import { dasriDraftSchema } from "../../validation";
import { checkIsBsdasriContributor } from "../../permissions";

const createBsdasriResolver = async (
  parent: ResolversParentTypes["Mutation"],
  { bsdasriCreateInput }: MutationCreateBsdasriArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const formSirets = {
    emitterCompanySiret: bsdasriCreateInput.emitter?.company?.siret,
    recipientCompanySiret: bsdasriCreateInput.recipient?.company?.siret,
    transporterCompanySiret: bsdasriCreateInput.transporter?.company?.siret
  };

  await checkIsBsdasriContributor(
    user,
    formSirets,
    "Vous ne pouvez pas créer un bordereau sur lequel votre entreprise n'apparaît pas"
  );

  const flattenedInput = flattenBsdasriInput(bsdasriCreateInput);
  await dasriDraftSchema.validate(flattenedInput);
  try {
    const newDasri = await prisma.bsdasri.create({
      data: {
        ...flattenedInput,
        readableId: await getReadableId(ReadableIdPrefix.DASRI),
        owner: { connect: { id: user.id } }
      }
    });
    return expandBsdasriFromDb(newDasri);
  } catch (e) {
    console.log(e);
  }
};

export default createBsdasriResolver;
