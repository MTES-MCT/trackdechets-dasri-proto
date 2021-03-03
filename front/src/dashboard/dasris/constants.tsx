import { BsdasriStatus } from "generated/graphql/types";
export const statusLabels: { [key: string]: string } = {
  DRAFT: "Brouillon",
  SEALED: "Scellé",
  READY_FOR_TAKEOVER: "En attente de collecte par le transporteur",
  SENT: "En attente de réception",
  RECEIVED: "Reçu, en attente de traitement",
  PROCESSED: "Traité",
};

export const statusesWithDynamicActions = [
  BsdasriStatus.Sent,
  BsdasriStatus.Received,
];
