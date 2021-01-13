import prisma from "../../../prisma";
import {
  MutationDasriCreateArgs,
  ResolversParentTypes
} from "../../../generated/graphql/types";
import { GraphQLContext } from "../../../types";
import { expandDasriFromDb, flattenDasriInput } from "../../dasri-converter";
import { getReadableId } from "../../dasri-readable-id";
import { checkIsAuthenticated } from "../../../common/permissions";
import { dasriDraftSchema } from "../../validation";
import { checkIsDasriContributor } from "../../permissions";

const dasriCreateResolver = async (
  parent: ResolversParentTypes["Mutation"],
  { dasriCreateInput }: MutationDasriCreateArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const formSirets = {
    emitterCompanySiret: dasriCreateInput.emitter?.company?.siret,
    recipientCompanySiret: dasriCreateInput.recipient?.company?.siret,
    transporterCompanySiret: dasriCreateInput.transporter?.company?.siret
  };

  await checkIsDasriContributor(user, formSirets);

  const flattenedInput = flattenDasriInput(dasriCreateInput);
  await dasriDraftSchema.validate(flattenedInput);
  try {
    const newDasri = await prisma.dasri.create({
      data: {
        ...flattenedInput,
        readableId: await getReadableId(),
        owner: { connect: { id: user?.id } }
      }
    });
    return expandDasriFromDb(newDasri);
  } catch (e) {
    console.log(e);
  }
};

export default dasriCreateResolver;
