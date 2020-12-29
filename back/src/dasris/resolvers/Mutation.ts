import dasriCreate from "./mutations/dasriCreate";
import dasriUpdate from "./mutations/dasriUpdate";
import dasriMarkAsReady from "./mutations/dasriMarkAsReady";
import { MutationResolvers } from "../../generated/graphql/types";

const Mutation: MutationResolvers = {
  dasriCreate,
  dasriUpdate,
  dasriMarkAsReady
};

export default Mutation;
