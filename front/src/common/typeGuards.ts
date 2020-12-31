import { Form, Dasri } from "generated/graphql/types";

export function isDasri(bsd: Dasri | Form): bsd is Dasri {
  return (bsd as Dasri).__typename === "Dasri";
}
export function isForm(bsd: Dasri | Form): bsd is Form {
  return (bsd as Form).__typename === "Form";
}
