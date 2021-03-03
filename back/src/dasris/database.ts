import prisma from "../prisma";

import { BsdasriNotFound } from "./errors";
import { UserInputError } from "apollo-server-express";
import { Prisma, Bsdasri } from "@prisma/client";

import { BsdasriRole } from "../generated/graphql/types";
import { FullBsdasri } from "./types";
/**
 * Retrieves a dasri by id or readableId or throw a BsdasriNotFound error
 */
export async function getBsdasriOrNotFound({
  id,
  readableId
}: Prisma.BsdasriWhereUniqueInput) {
  if (!id && !readableId) {
    throw new UserInputError("You should specify an id or a readableId");
  }

  const bsdasri = await prisma.bsdasri.findUnique({
    where: id ? { id } : { readableId }
  });

  if (bsdasri == null || bsdasri.isDeleted == true) {
    throw new BsdasriNotFound(id ? id.toString() : readableId);
  }
  return bsdasri;
}

/**
 * Get a filter to retrieve dasris the passed siret has rights on
 * Optional parameter roles allows to filter on specific roles
 * For example getBsdasrisRightFilter(company, [TRANSPORTER]) will return a filter
 * only for the forms in which the company appears as a transporter
 * @param siret the siret to filter on
 * @param roles optional [FormRole] to refine filter
 */
export function getBsdasrisRightFilter(siret: string, roles?: BsdasriRole[]) {
  const filtersByRole: {
    [key in BsdasriRole]: Partial<Prisma.BsdasriWhereInput>[];
  } = {
    ["RECIPIENT"]: [{ recipientCompanySiret: siret }],
    ["EMITTER"]: [{ emitterCompanySiret: siret }],
    ["TRANSPORTER"]: [{ transporterCompanySiret: siret }]
  };

  return {
    OR: Object.keys(filtersByRole)
      .filter((role: BsdasriRole) =>
        roles?.length > 0 ? roles.includes(role) : true
      )
      .map(role => filtersByRole[role])
      .flat()
  };
}

/**
 * Returns a prisma Dasri object with its owner
 * @param bsdasri
 */
export async function getFullBsdasri(bsdasri: Bsdasri): Promise<FullBsdasri> {
  const owner = await prisma.form
    .findUnique({ where: { id: bsdasri.id } })
    .owner();

  return {
    ...bsdasri,
    owner
  };
}
