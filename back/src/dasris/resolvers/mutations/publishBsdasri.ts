import { checkIsAuthenticated } from "../../../common/permissions";
import { MutationResolvers } from "../../../generated/graphql/types";
import { getBsdasriOrNotFound } from "../../database";
import { expandBsdasriFromDb } from "../../dasri-converter";
import {
  checkIsBsdasriContributor,
  checkIsBsdasriPublishable
} from "../../permissions";
import prisma from "../../../prisma";
// import { okForSealedFormSchema } from "../../validation";
const publishBsdasriResolver: MutationResolvers["publishBsdasri"] = async (
  _,
  { id },
  context
) => {
  const user = checkIsAuthenticated(context);
  const bsdasri = await getBsdasriOrNotFound({ id });
  await checkIsBsdasriContributor(
    user,
    bsdasri,
    "Vous ne pouvez pas mettre ce borderau dasri à jour si vous ne figurez pas dessus"
  );
  await checkIsBsdasriPublishable(user, bsdasri);

  // publish  dasri
  const publishedBsdasri = await prisma.bsdasri.update({
    where: { id: bsdasri.id },
    data: { isDraft: false }
  });
  return expandBsdasriFromDb(publishedBsdasri);
};

export default publishBsdasriResolver;
