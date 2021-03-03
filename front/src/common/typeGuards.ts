import { Form, Bsdasri } from "generated/graphql/types";

export function isDasri(bsd: Bsdasri | Form): bsd is Bsdasri {
  return (bsd as Bsdasri).__typename === "Bsdasri";
}
export function isForm(bsd: Bsdasri | Form): bsd is Form {
  return (bsd as Form).__typename === "Form";
}
