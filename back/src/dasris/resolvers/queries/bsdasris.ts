import { expandBsdasriFromDb } from "../../dasri-converter";
import { Bsdasri, QueryResolvers } from "../../../generated/graphql/types";
import prisma from "../../../prisma";
import { checkIsAuthenticated } from "../../../common/permissions";
import { Company, BsdasriStatus } from "@prisma/client";
import { MissingSiret } from "../../../common/errors";
import { getCompanyOrCompanyNotFound } from "../../../companies/database";
import { checkIsCompanyMember } from "../../../users/permissions";
import { getUserCompanies } from "../../../users/database";
import { getCursorConnectionsArgs } from "../../cursorPagination";
import { getBsdasrisRightFilter } from "../../../dasris/database";

export async function getBsdasris(): Promise<Bsdasri[]> {
  const queried = await prisma.bsdasri.findMany();
  return queried.map(f => expandBsdasriFromDb(f));
}

const dasrisResolver: QueryResolvers["bsdasris"] = async (_, args, context) => {
  const user = checkIsAuthenticated(context);

  const { siret, status, roles, hasNextStep, ...rest } = args;

  let company: Company | null = null;
  if (siret) {
    // a siret is specified, check user has permission on this company
    company = await getCompanyOrCompanyNotFound({ siret });
    await checkIsCompanyMember({ id: user.id }, { siret });
  } else {
    const userCompanies = await getUserCompanies(user.id);
    if (userCompanies.length === 0) {
      // the user is not member of any companies, return empty array
      return [];
    }

    if (userCompanies.length > 1) {
      // the user is member of 2 companies or more, a siret is required
      throw new MissingSiret();
    }

    // the user is member of only one company, use it as default
    company = userCompanies[0];
  }

  const connectionsArgs = getCursorConnectionsArgs({
    ...rest,
    defaultPaginateBy: 50,
    maxPaginateBy: 500
  });

  const queried = await prisma.bsdasri.findMany({
    ...connectionsArgs,
    orderBy: { createdAt: "desc" },
    where: {
      ...(rest.updatedAfter && {
        updatedAt: { gte: new Date(rest.updatedAfter) }
      }),
      wasteDetailsCode: rest.wasteCode,
      ...(status?.length && { status: { in: status } }),
      AND: [
        getBsdasrisRightFilter(company.siret, roles),
        getHasNextStepFilter(company.siret, hasNextStep),

        ...(rest.siretPresentOnForm
          ? [getBsdasrisRightFilter(rest.siretPresentOnForm, [])]
          : [])
      ],

      isDeleted: false
    }
  });
  return queried.map(f => expandBsdasriFromDb(f));
};

export default dasrisResolver;

function getHasNextStepFilter(siret: string, hasNextStep?: boolean | null) {
  if (hasNextStep == null) {
    return {};
  }

  const filter = {
    OR: [
      // DRAFT
      { status: BsdasriStatus.DRAFT },
      // isEmitter && SEALED
      {
        AND: [{ emitterCompanySiret: siret }, { status: BsdasriStatus.SEALED }]
      },
      // isRecipient && (RECEIVED || ACCEPTED )
      {
        AND: [
          { recipientCompanySiret: siret },
          {
            OR: [
              { status: BsdasriStatus.SENT },
              { status: BsdasriStatus.RECEIVED }
            ]
          }
        ]
      }
    ]
  };

  return hasNextStep ? filter : { NOT: filter };
}
