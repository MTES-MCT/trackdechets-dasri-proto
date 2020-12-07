import prisma from "../../../prisma";
import {
  MutationDasriCreateArgs,
  ResolversParentTypes
} from "../../../generated/graphql/types";
import { GraphQLContext } from "../../../types";
import {
  expandDasriFormFromDb,
  flattenDasriFormInput
} from "../../form-converter";
import { getReadableId } from "../../dasri-readable-id";

const dasriCreateResolver = async (
  parent: ResolversParentTypes["Mutation"],
  { dasriCreateInput }: MutationDasriCreateArgs,
  context: GraphQLContext
) => {
  //   const user = checkIsAuthenticated(context);

  const flattenedInput = flattenDasriFormInput(dasriCreateInput);

  const owner = await prisma.user.findOne({
    where: { email: "lp@providenz.fr" }
  });
  console.log(flattenedInput);
  const newForm = await prisma.dasriForm.create({
    data: {
      ...flattenedInput,
      readableId: await getReadableId(),
      owner: { connect: { id: owner?.id } }
    }
  });

  return expandDasriFormFromDb(newForm);
};

export default dasriCreateResolver;
