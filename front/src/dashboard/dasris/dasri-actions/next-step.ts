import { Bsdasri, BsdasriStatus } from "generated/graphql/types";

export function getDasriNextStep(bsd: Bsdasri, currentSiret: string) {
  const currentUserIsRecipient = currentSiret === bsd.recipient?.company?.siret;
  const currentUserIsEmitter = currentSiret === bsd.emitter?.company?.siret;
 
  if (bsd.status === BsdasriStatus.Draft) return BsdasriStatus.Sealed;

  if (currentUserIsEmitter) {
    if (bsd.status === BsdasriStatus.Sealed) return BsdasriStatus.ReadyForTakeover;
  }
  if (currentUserIsRecipient) {
    if (bsd.status === BsdasriStatus.Sent) return BsdasriStatus.Received;
    if (bsd.status === BsdasriStatus.Received) return BsdasriStatus.Processed;
  }

  return null;
}

function isDraftStatus(status: string) {
  return status === BsdasriStatus.Draft;
}

function isHistoryStatus(status: string) {
  return [BsdasriStatus.Processed, BsdasriStatus.Refused].includes(
    status as BsdasriStatus
  );
}
