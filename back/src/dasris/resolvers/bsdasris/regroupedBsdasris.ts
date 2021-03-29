import { BsdasriResolvers } from "../../../generated/graphql/types";
import prisma from "../../../prisma";
  import { stringifyDates } from "../../database";

const regroupedBsdasris: BsdasriResolvers["regroupedBsdasris"] = async bsdasri => {
  const regroupedBsdasris = await prisma.bsdasri
    .findUnique({ where: { id: bsdasri.id } })
    .regroupedBsdasris();
  return regroupedBsdasris.map(bsdasri => stringifyDates(bsdasri));
};

export default regroupedBsdasris;