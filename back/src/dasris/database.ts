import prisma from "../prisma";

import { DasriNotFound } from "./errors";
import { UserInputError } from "apollo-server-express";
import { DasriWhereInput, DasriWhereUniqueInput } from "@prisma/client";

import { DasriRole } from "../generated/graphql/types";

/**
 * Retrieves a form by id or readableId or throw a FormNotFound error
 */
export async function getDasriOrDasriNotFound({
  id,
  readableId
}: DasriWhereUniqueInput) {
  if (!id && !readableId) {
    throw new UserInputError("You should specify an id or a readableId");
  }
  const form = await prisma.dasri.findOne({
    where: { id: id ? id : readableId }
  });
  if (form == null || form.isDeleted == true) {
    throw new DasriNotFound(id ? id.toString() : readableId);
  }
  return form;
}

/**
 * Get a filter to retrieve dasris the passed siret has rights on
 * Optional parameter roles allows to filter on specific roles
 * For example getDasrisRightFilter(company, [TRANSPORTER]) will return a filter
 * only for the forms in which the company appears as a transporter
 * @param siret the siret to filter on
 * @param roles optional [FormRole] to refine filter
 */
export function getDasrisRightFilter(siret: string, roles?: DasriRole[]) {
  const filtersByRole: { [key in DasriRole]: Partial<DasriWhereInput>[] } = {
    ["RECIPIENT"]: [{ recipientCompanySiret: siret }],
    ["EMITTER"]: [{ emitterCompanySiret: siret }],
    ["TRANSPORTER"]: [{ transporterCompanySiret: siret }]
  };

  return {
    OR: Object.keys(filtersByRole)
      .filter((role: DasriRole) =>
        roles?.length > 0 ? roles.includes(role) : true
      )
      .map(role => filtersByRole[role])
      .flat()
  };
}
