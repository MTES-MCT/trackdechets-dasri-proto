import createBsdasri from "./mutations/createBsdasri";
import updateBsdasri from "./mutations/updateBsdasri";
import markAsReadyBsdasri from "./mutations/markAsReadyBsdasri";
import signBsdasri from "./mutations/signBsdasri";
import { MutationResolvers } from "../../generated/graphql/types";

const Mutation: MutationResolvers = {
  createBsdasri,
  updateBsdasri,
  markAsReadyBsdasri,
  signBsdasri
};

export default Mutation;
