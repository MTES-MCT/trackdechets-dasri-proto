import { Company, Dasri, User } from "@prisma/client";

import { getFullUser } from "../users/database";
import { FullUser } from "../users/types";

import { NotDasriContributor } from "./errors";
import { FullDasri } from "./types";
function isDasriOwner(user: User, dasri: { owner: User }) {
  return dasri.owner?.id === user.id;
}

function isDasriEmitter(user: { companies: Company[] }, dasri: Dasri) {
  if (!dasri.emitterCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.emitterCompanySiret);
}

function isDasriRecipient(user: { companies: Company[] }, dasri: Dasri) {
  if (!dasri.recipientCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.recipientCompanySiret);
}

function isDasriTransporter(user: { companies: Company[] }, dasri: Dasri) {
  if (!dasri.transporterCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.transporterCompanySiret);
}

export function isDasriContributor(user: FullUser, dasri: FullDasri) {
  console.log(dasri.ownerId);
  return [
    isDasriOwner,
    isDasriEmitter,
    isDasriTransporter,
    isDasriRecipient
  ].some(isFormRole => isFormRole(user, dasri));
}

/**
 * Only users who belongs to a company that appears on the dasri
 * can read, update or delete it
 */
export async function checkCanReadUpdateDeleteDasri(
  user: User,
  dasri: FullDasri
) {
  // user with companies
  const fullUser = await getFullUser(user);

  if (!isDasriContributor(fullUser, dasri)) {
    throw new NotDasriContributor();
  }

  return true;
}
