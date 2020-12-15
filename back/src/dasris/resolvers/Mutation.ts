import dasriCreate from "./mutations/dasriCreate";
import dasriUpdate from "./mutations/dasriUpdate";
import { MutationResolvers } from "../../generated/graphql/types";

const Mutation: MutationResolvers = {
  dasriCreate,
  dasriUpdate
};

export default Mutation;
