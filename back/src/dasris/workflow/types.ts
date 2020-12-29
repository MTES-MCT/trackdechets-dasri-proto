import { Prisma } from "@prisma/client";

// Xstate possible states
export enum DasriState {
  Draft = "DRAFT",
  Sealed = "SEALED" // we keep this terminology for now, although it is a bit confusing
}

// Xstate event type
export enum DasriEventType {
  MarkAsReady = "MARK_AS_READY"
}

// Xstate event
export type DasriEvent = {
  type: DasriEventType;
  dasripdateInput?: Prisma.DasriUpdateInput;
};
