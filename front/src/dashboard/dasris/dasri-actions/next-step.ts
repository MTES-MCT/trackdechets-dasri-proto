import { Bsdasri, BsdasriStatus } from "generated/graphql/types";

export function getDasriNextStep(bsd: Bsdasri, currentSiret: string) {
  const currentUserIsRecipient = currentSiret === bsd.recipient?.company?.siret;
  const currentUserIsEmitter = currentSiret === bsd.emitter?.company?.siret;

  if (bsd.isDraft) return BsdasriStatus.Initial;

  if (currentUserIsEmitter) {
    if (bsd.status === BsdasriStatus.Initial)
      return BsdasriStatus.SignedByProducer;
  }
  if (currentUserIsRecipient) {
    if (bsd.status === BsdasriStatus.Sent) return BsdasriStatus.Received;
    if (bsd.status === BsdasriStatus.Received) return BsdasriStatus.Processed;
  }

  return null;
}


function isHistoryStatus(status: string) {
  return [BsdasriStatus.Processed, BsdasriStatus.Refused].includes(
    status as BsdasriStatus
  );
}
