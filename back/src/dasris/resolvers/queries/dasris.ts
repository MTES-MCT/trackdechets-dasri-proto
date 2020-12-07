import { expandDasriFormFromDb } from "../../form-converter";
import { DasriForm, QueryResolvers } from "../../../generated/graphql/types";
import prisma from "../../../prisma";

export async function getForms(): Promise<DasriForm[]> {
  const queried = await prisma.dasriForm.findMany();
  return queried.map(f => expandDasriFormFromDb(f));
}

const formsResolver: QueryResolvers["dasriForms"] = async (
  _,
  args,
  context
) => {
  return getForms();
};

export default formsResolver;
