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
import { validateBsdasri } from "../../validation";
import { checkIsBsdasriContributor } from "../../permissions";

const createDraftBsdasriResolver = async (
  parent: ResolversParentTypes["Mutation"],
  { bsdasriCreateInput: input }: MutationCreateBsdasriArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const { regroupedBsdasris, ...bsdasriCreateInput } = input;

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

  await validateBsdasri(flattenedInput, {});
  try {
    const newDasri = await prisma.bsdasri.create({
      data: {
        ...flattenedInput,
        id: getReadableId(ReadableIdPrefix.DASRI),

        owner: { connect: { id: user.id } },
        regroupedBsdasris: { connect: regroupedBsdasris },
        isDraft: true
      }
    });
    return expandBsdasriFromDb(newDasri);
  } catch (e) {
    console.log(e);
  }
};

export default createDraftBsdasriResolver;
