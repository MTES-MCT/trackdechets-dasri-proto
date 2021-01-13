import { Company, Dasri, User } from "@prisma/client";

import { getFullUser } from "../users/database";
import { getFullDasri } from "./database";
import { DasriSirets } from "src/dasris/types";
import { ForbiddenError } from "apollo-server-express";

import { NotDasriContributor } from "./errors";
import { FullDasri } from "./types";

function isDasriOwner(user: User, dasri: { owner: User }) {
  return dasri.owner?.id === user.id;
}

function isDasriEmitter(user: { companies: Company[] }, dasri: DasriSirets) {
  if (!dasri.emitterCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.emitterCompanySiret);
}

function isDasriRecipient(user: { companies: Company[] }, dasri: DasriSirets) {
  if (!dasri.recipientCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.recipientCompanySiret);
}

function isDasriTransporter(
  user: { companies: Company[] },
  dasri: DasriSirets
) {
  if (!dasri.transporterCompanySiret) {
    return false;
  }
  const sirets = user.companies.map(c => c.siret);
  return sirets.includes(dasri.transporterCompanySiret);
}

export async function isDasriContributor(user: User, dasri: DasriSirets) {
  const fullUser = await getFullUser(user);
  return [
    isDasriEmitter,
    isDasriTransporter,
    isDasriRecipient
  ].some(isFormRole => isFormRole(fullUser, dasri));
}

export async function checkIsDasriContributor(user: User, dasri: DasriSirets) {
  const isContributor = await isDasriContributor(user, dasri);

  if (!isContributor) {
    throw new NotDasriContributor();
  }

  return true;
}

/**
 * Only users who belongs to a company that appears on the dasri
 * can update it
 */
export async function checkCanUpdateDasri(user: User, dasri: Dasri) {
  const fullUser = await getFullUser(user);
  const fullDasri = await getFullDasri(dasri);

  if (!isDasriContributor(fullUser, fullDasri)) {
    throw new NotDasriContributor();
  }

  return true;
}

export async function checkCanMarkDasriAsReady(user: User, dasri: Dasri) {
  const fullUser = await getFullUser(user);
  const fullDasri = await getFullDasri(dasri);
  if (!isDasriContributor(fullUser, fullDasri)) {
    throw new ForbiddenError(
      "Vous n'êtes pas autorisé à marquer ce dasri comme prêt"
    );
  }

  return true;
}
