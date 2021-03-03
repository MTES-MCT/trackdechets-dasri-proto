import { Company, User, Bsdasri } from "@prisma/client";

import { getFullUser } from "../users/database";

import { BsdasriSirets } from "./types";

import { NotFormContributor } from "../forms/errors";
import { getFullBsdasri } from "./database";

function isDasriEmitter(user: { companies: Company[] }, dasri: BsdasriSirets) {
  if (!dasri.emitterCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.emitterCompanySiret);
}

function isDasriRecipient(
  user: { companies: Company[] },
  dasri: BsdasriSirets
) {
  if (!dasri.recipientCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.recipientCompanySiret);
}

function isDasriTransporter(
  user: { companies: Company[] },
  dasri: BsdasriSirets
) {
  if (!dasri.transporterCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.transporterCompanySiret);
}

export async function isDasriContributor(user: User, dasri: BsdasriSirets) {
  const fullUser = await getFullUser(user);

  return [
    isDasriEmitter,
    isDasriTransporter,
    isDasriRecipient
  ].some(isFormRole => isFormRole(fullUser, dasri));
}

export async function checkIsBsdasriContributor(
  user: User,
  dasri: BsdasriSirets,
  errorMsg: string
) {
  const isContributor = await isDasriContributor(user, dasri);

  if (!isContributor) {
    throw new NotFormContributor(errorMsg);
  }

  return true;
}

export async function checkCanReadBsdasri(user: User, bsdasri: Bsdasri) {
  return checkIsBsdasriContributor(
    user,

    await getFullBsdasri(bsdasri),
    "Vous n'êtes pas autorisé à accéder à ce bordereau"
  );
}
