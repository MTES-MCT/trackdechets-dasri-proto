import { expandBsdasriFromDb } from "../../dasri-converter";

import prisma from "../../../prisma";
import { checkIsAuthenticated } from "../../../common/permissions";
import { Company, BsdasriStatus } from "@prisma/client";
import { MissingSiret } from "../../../common/errors";
import { getCompanyOrCompanyNotFound } from "../../../companies/database";
import { checkIsCompanyMember } from "../../../users/permissions";
import { getUserCompanies } from "../../../users/database";
import { getCursorConnectionsArgs } from "../../cursorPagination";

import { GraphQLContext } from "../../../types";
import { convertWhereToDbFilter } from "./where";
export default async function dasris(_, args, context: GraphQLContext) {
  const user = checkIsAuthenticated(context);

  const { where: whereArgs, siret, ...rest } = args;

  let company: Company | null = null;

  if (siret) {
    // a siret is specified, check user has permission on this company
    company = await getCompanyOrCompanyNotFound({ siret });
    await checkIsCompanyMember({ id: user.id }, { siret });
  } else {
    const userCompanies = await getUserCompanies(user.id);
    if (userCompanies.length === 0) {
      // the user is not member of any companies, return empty array
      return {
        totalCount: 0,
        edges: [],
        pageInfo: {
          startCursor: "",
          endCursor: "",
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }

    if (userCompanies.length > 1) {
      // the user is member of 2 companies or more, a siret is required
      throw new MissingSiret();
    }

    // the user is member of only one company, use it as default
    company = userCompanies[0];
  }
  const itemsPerPage = 50;
  const { requiredItems, ...connectionsArgs } = await getCursorConnectionsArgs({
    ...rest,
    defaultPaginateBy: itemsPerPage,
    maxPaginateBy: 500
  });
  const where = {
    ...convertWhereToDbFilter(whereArgs),
    isDeleted: false
  };
  const queried = await prisma.bsdasri.findMany({
    ...connectionsArgs,
    orderBy: { createdAt: "desc" },

    where
  });
  const totalCount = await prisma.bsdasri.count({ where });
  const queriedCount = queried.length;

  const expanded = queried.map(f => expandBsdasriFromDb(f));
  const pageInfo = {
    startCursor: expanded[0]?.id || "",
    endCursor: expanded[queriedCount - 1]?.id || "",
    hasNextPage: rest.after | rest.first ? queriedCount > requiredItems : false,
    hasPreviousPage:
      rest.before | rest.last ? queriedCount > requiredItems : false
  };
  return {
    totalCount,
    edges: expanded.map(bsd => ({ cursor: bsd.id, node: bsd })),
    pageInfo
  };
}
