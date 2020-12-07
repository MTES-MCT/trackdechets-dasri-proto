import prisma from "../../../prisma";
import {
  MutationDasriCreateArgs,
  ResolversParentTypes
} from "../../../generated/graphql/types";
import { GraphQLContext } from "../../../types";
import {
  expandDasriFormFromDb,
  flattenDasriFormInput
} from "../../dasri-converter";
import { getReadableId } from "../../dasri-readable-id";
import { checkIsAuthenticated } from "../../../common/permissions";

const dasriCreateResolver = async (
  parent: ResolversParentTypes["Mutation"],
  { dasriCreateInput }: MutationDasriCreateArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const flattenedInput = flattenDasriFormInput(dasriCreateInput);

  const newForm = await prisma.dasri.create({
    data: {
      ...flattenedInput,
      readableId: await getReadableId(),
      owner: { connect: { id: user?.id } }
    }
  });

  return expandDasriFormFromDb(newForm);
};

export default dasriCreateResolver;
