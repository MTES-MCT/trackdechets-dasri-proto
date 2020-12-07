import dasriForms from "./queries/dasris";
import dasriForm from "./queries/dasri";
import { QueryResolvers } from "../../generated/graphql/types";
const Query: QueryResolvers = {
  dasriForms,
  dasriForm
};

export default Query;
