import { Bsdasri, Prisma, BsdasriStatus } from "@prisma/client";
import prisma from "../../prisma";
import { BsdasriEvent } from "./types";
import machine from "./machine";
import { InvalidTransition } from "../../forms/errors";
import { ObjectSchema } from "yup";

/**
 * Transition a form from initial state (ex: DRAFT) to next state (ex: SEALED)
 * Allowed transitions are defined as a state machine using xstate
 */
export default async function dasriTransition(
  bsdasri: Bsdasri,
  event: BsdasriEvent,
  validator?: ObjectSchema
) {
  const currentStatus = bsdasri.status;

  // are required dasri fields filled ?
  if (!!validator) {
    await validator.validate(bsdasri);
  }
  // Use state machine to calculate new status
  const nextState = machine.transition(currentStatus, event, bsdasri);

  // This transition is not possible
  if (!nextState.changed) {
    throw new InvalidTransition();
  }

  const nextStatus = nextState.value as BsdasriStatus;

  const dasriUpdateInput: Prisma.BsdasriUpdateInput = {
    status: nextStatus,
    ...event.dasriUpdateInput
  };

  // update dasri
  const updatedForm = await prisma.bsdasri.update({
    where: { id: bsdasri.id },
    data: dasriUpdateInput
  });

  return updatedForm;
}
