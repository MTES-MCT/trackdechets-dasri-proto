import prisma from "../prisma";

import { FormNotFound } from "./errors";
import { UserInputError } from "apollo-server-express";

import { DasriForm } from "../generated/graphql/types";

/**
 * Retrieves a form by id or readableId or throw a FormNotFound error
 */
export async function getDasriOrDasriNotFound({ id, readableId }: DasriForm) {
  if (!id && !readableId) {
    throw new UserInputError("You should specify an id or a readableId");
  }
  const form = await prisma.dasriForm.findOne({
    where: { id: id ? id : readableId }
  });
  if (form == null || form.isDeleted == true) {
    throw new FormNotFound(id ? id.toString() : readableId);
  }
  return form;
}
