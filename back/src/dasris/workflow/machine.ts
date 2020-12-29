import { Machine } from "xstate";
import { DasriState, DasriEventType, DasriEvent } from "./types";

/**
 * Workflow state machine for dasris
 */
const machine = Machine<any, DasriEvent>({
  id: "dasri-workflow-machine",
  initial: DasriState.Draft,
  states: {
    [DasriState.Draft]: {
      on: {
        [DasriEventType.MarkAsReady]: [{ target: DasriState.Sealed }]
      }
    },
    [DasriState.Sealed]: { type: "final" },
    error: {
      states: {}
    }
  }
});

export default machine;
