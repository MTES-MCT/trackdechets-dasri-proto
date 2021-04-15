import { expandBsdasriFromDb } from "../../dasri-converter";

import prisma from "../../../prisma";
import { checkIsAuthenticated } from "../../../common/permissions";

import { getCompanyOrCompanyNotFound } from "../../../companies/database";
import { checkIsCompanyMember } from "../../../users/permissions";

import { getCursorConnectionsArgs } from "../../cursorPagination";

import { GraphQLContext } from "../../../types";
import { convertWhereToDbFilter } from "./where";
export default async function dasris(_, args, context: GraphQLContext) {
  const user = checkIsAuthenticated(context);

  const { where: whereArgs, siret, ...rest } = args;

  // check user has permission on the specified siret
  const company = await getCompanyOrCompanyNotFound({ siret });
  await checkIsCompanyMember({ id: user.id }, { siret });

  const itemsPerPage = 50;
  const { requiredItems, ...connectionsArgs } = await getCursorConnectionsArgs({
    ...rest,
    defaultPaginateBy: itemsPerPage,
    maxPaginateBy: 500
  });
  const where = {
    ...convertWhereToDbFilter(whereArgs, company.siret),
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
