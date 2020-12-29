import { checkIsAuthenticated } from "../../../common/permissions";
import { MutationResolvers } from "../../../generated/graphql/types";
import { getDasriOrDasriNotFound } from "../../database";
import { expandDasriFromDb } from "../../dasri-converter";
import { checkCanMarkDasriAsReady } from "../../permissions";

import dasriTransition from "../../workflow/dasriTransition";
import { DasriEventType } from "../../workflow/types";

const markAsReadyResolver: MutationResolvers["dasriMarkAsReady"] = async (
  parent,
  { id },
  context
) => {
  const user = checkIsAuthenticated(context);
  const dasri = await getDasriOrDasriNotFound({ id });
  await checkCanMarkDasriAsReady(user, dasri);

  const sealedDasri = await dasriTransition(user, dasri, {
    type: DasriEventType.MarkAsReady
  });

  return expandDasriFromDb(sealedDasri);
};

export default markAsReadyResolver;
