import prisma from "../../../prisma";
import {
  MutationCreateBsdasriArgs,
  ResolversParentTypes
} from "../../../generated/graphql/types";
import { GraphQLContext } from "../../../types";
import {
  expandBsdasriFromDb,
  flattenBsdasriInput
} from "../../dasri-converter";
import getReadableId, { ReadableIdPrefix } from "../../../common/readableId";
import { checkIsAuthenticated } from "../../../common/permissions";
import { validateBsdasri } from "../../validation";
import { checkIsBsdasriContributor } from "../../permissions";

const checkDasrisAreGroupable = async (regroupedBsdasris, emitterSiret) => {
  if (!regroupedBsdasris) {
    return;
  }
  if (!regroupedBsdasris.length) {
    return;
  }
  const regroupedBsdasrisIds = regroupedBsdasris.map(dasri => dasri.id);
  // retrieve dasris which:
  // id is in regroupedBsdasrisIds
  // are in PROCESSED status
  // whose processingOperation is either D12 or  R12
  // which are not already grouped
  const found = await prisma.bsdasri.findMany({
    where: {
      id: { in: regroupedBsdasrisIds },
      processingOperation: { in: ["R12", "D12"] },
      status: "PROCESSED",
      regroupedOnBsdasri: null
      // recipientCompanySiret: emitterSiret
    },
    select: { id: true }
  });

  const foundIds = found.map(el => el.id);
  const diff = regroupedBsdasrisIds.filter(el => !foundIds.includes(el));

  if (!!diff.length) {
    throw new Error(
      `Les dasris suivants ne peuvent pas être regroupés ${diff.join()}`
    );
  }
};

const emitterIsAllowedToGroup = async emitterSiret => {
  const emitterCompany = await prisma.company.findUnique({
    where: { siret: emitterSiret }
  });
  if (!emitterCompany?.companyTypes.includes("COLLECTOR")) {
    throw new Error(
      "Le siret de l'émetteur n'est pas autorisé à regrouper des dasris"
    );
  }
};
const createBsdasriResolver = async (
  parent: ResolversParentTypes["Mutation"],
  { bsdasriCreateInput: input }: MutationCreateBsdasriArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const { regroupedBsdasris, ...bsdasriCreateInput } = input;

  const formSirets = {
    emitterCompanySiret: bsdasriCreateInput.emitter?.company?.siret,
    recipientCompanySiret: bsdasriCreateInput.recipient?.company?.siret,
    transporterCompanySiret: bsdasriCreateInput.transporter?.company?.siret
  };

  await checkIsBsdasriContributor(
    user,
    formSirets,
    "Vous ne pouvez pas créer un bordereau sur lequel votre entreprise n'apparaît pas"
  );

  const flattenedInput = flattenBsdasriInput(bsdasriCreateInput);

  await validateBsdasri(flattenedInput, { emissionSignature: true });

  await emitterIsAllowedToGroup(flattenedInput?.emitterCompanySiret);
  await checkDasrisAreGroupable(
    regroupedBsdasris,
    flattenedInput.emitterCompanySiret
  );
  try {
    const newDasri = await prisma.bsdasri.create({
      data: {
        ...flattenedInput,
        id: await getReadableId(ReadableIdPrefix.DASRI),
        owner: { connect: { id: user.id } },
        regroupedBsdasris: { connect: regroupedBsdasris }
      }
    });
    return expandBsdasriFromDb(newDasri);
  } catch (e) {
    console.log(e);
  }
};

export default createBsdasriResolver;
