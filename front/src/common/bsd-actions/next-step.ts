import { Dasri, DasriStatus } from "generated/graphql/types";

export function getDasriNextStep(bsd: Dasri, currentSiret: string) {
  const currentUserIsRecipient = currentSiret === bsd.recipient?.company?.siret;

  if (bsd.status === DasriStatus.Draft) return DasriStatus.Sealed;

  if (currentUserIsRecipient) {
    if (bsd.status === DasriStatus.Received) return DasriStatus.Processed;
  }

  return null;
}

function isDraftStatus(status: string) {
  return status === DasriStatus.Draft;
}

function isHistoryStatus(status: string) {
  return [DasriStatus.Processed, DasriStatus.Refused].includes(
    status as DasriStatus
  );
}
