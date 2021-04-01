import { BsdasriStatus } from "generated/graphql/types";
export const statusLabels: { [key: string]: string } = {
  DRAFT: "Brouillon",
  SEALED: "Scellé",
  SIGNED_BY_PRODUCER: "En attente de collecte par le transporteur",
  SENT: "En attente de réception",
  RECEIVED: "Reçu, en attente de traitement",
  PROCESSED: "Traité",
};

export const statusesWithDynamicActions = [
  BsdasriStatus.Sent,
  BsdasriStatus.Received,
];
