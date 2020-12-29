import { Dasri, Prisma, DasriStatus } from "@prisma/client";
import prisma from "src/prisma";
import { DasriEvent } from "./types";
import machine from "./machine";
import { InvalidTransition } from "../../forms/errors";

/**
 * Transition a form from initial state (ex: DRAFT) to next state (ex: SEALED)
 * Allowed transitions are defined as a state machine using xstate
 */
export default async function dasriTransition(
  user: Express.User,
  dasri: Dasri,
  event: DasriEvent
) {
  const currentStatus = dasri.status;

  // Use state machine to calculate new status
  const nextState = machine.transition(currentStatus, event);

  // This transition is not possible
  if (!nextState.changed) {
    throw new InvalidTransition();
  }

  const nextStatus = nextState.value as DasriStatus;

  const dasriUpdateInput: Prisma.DasriUpdateInput = {
    status: nextStatus,
    ...event.dasripdateInput
  };

  // update dasri
  const updatedForm = await prisma.dasri.update({
    where: { id: dasri.id },
    data: dasriUpdateInput
  });

  // TODO: handle status log and event emitters

  return updatedForm;
}
