import dasriCreate from "./mutations/dasriCreateForm";
import { MutationResolvers } from "../../generated/graphql/types";

const Mutation: MutationResolvers = {
  dasriCreate,
};

export default Mutation;
