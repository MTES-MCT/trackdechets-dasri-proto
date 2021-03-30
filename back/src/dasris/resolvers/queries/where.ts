import { Prisma } from "@prisma/client";
import { UserInputError } from "apollo-server-express";
import { safeInput } from "../../../forms/form-converter";
import { BsdasriWhere, DateFilter } from "../../../generated/graphql/types";

export function convertWhereToDbFilter(
  where: BsdasriWhere
): Prisma.BsdasriWhereInput {
  if (!where) {
    return {};
  }

  const { _or, _and, _not, ...filters } = where;
  // const or_not_and = [..._or, ..._and, ..._not];
  console.log(_or, _and, _not)
  // const hasNesting = or_not_and?.some(w => w._or || w._and || w._not);
  const hasOrNesting = _or?.some(w => w._or || w._and || w._not);
  const hasAndNesting = _and?.some(w => w._or || w._and || w._not);
  const hasNotNesting = _not?.some(w => w._or || w._and || w._not);

  if (hasOrNesting || hasAndNesting || hasNotNesting) {
    throw new UserInputError("Cannot nest conditions deeper than one level");
  }

  return safeInput({
    OR: _or?.map(w => toPrismaFilter(w)),
    AND: _and?.map(w => toPrismaFilter(w)),
    NOT: _not?.map(w => toPrismaFilter(w)),
    ...toPrismaFilter(filters)
  });
}

function toPrismaFilter(where: Omit<BsdasriWhere, "_or" | "_and" | "_not">) {
  return safeInput({
    createdAt: where.createdAt
      ? toPrismaDateFilter(where.createdAt)
      : undefined,
    updatedAt: where.updatedAt
      ? toPrismaDateFilter(where.updatedAt)
      : undefined,
    transporterCompanySiret: where.transporter?.company?.siret,
    emitterCompanySiret: where.emitter?.company?.siret,
    recipientCompanySiret: where.recipient?.company?.siret,
    status: where.status,
    isDraft: where.isDraft
  });
}

function toPrismaDateFilter(dateFilter: DateFilter): Prisma.DateTimeFilter {
  return safeInput({
    gt: dateFilter._gt,
    gte: dateFilter._gte,
    lt: dateFilter._lt,
    lte: dateFilter._lte,
    equals: dateFilter._eq
  });
}
