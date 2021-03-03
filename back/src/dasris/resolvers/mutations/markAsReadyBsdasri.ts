import { checkIsAuthenticated } from "../../../common/permissions";
import { MutationResolvers } from "../../../generated/graphql/types";
import { getBsdasriOrNotFound } from "../../database";
import { expandBsdasriFromDb } from "../../dasri-converter";
import { checkIsBsdasriContributor } from "../../permissions";

import dasriTransition from "../../workflow/dasriTransition";
import { BsdasriEventType } from "../../workflow/types";
import { okForSealedFormSchema } from "../../validation";
const markAsReadyResolver: MutationResolvers["markAsReadyBsdasri"] = async (
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

  const sealedBsdasri = await dasriTransition(
    bsdasri,
    {
      type: BsdasriEventType.MarkAsReady
    },
    okForSealedFormSchema
  );

  return expandBsdasriFromDb(sealedBsdasri);
};

export default markAsReadyResolver;
