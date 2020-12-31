import { DasriStatus } from "generated/graphql/types";
export const statusLabels: { [key: string]: string } = {
  DRAFT: "Brouillon",
  SEALED: "En attente de collecte par le transporteur",
  SENT: "En attente de réception",
  RECEIVED: "Reçu, en attente de traitement",
  PROCESSED: "Traité",
};

export const statusesWithDynamicActions = [
  DasriStatus.Sent,
  DasriStatus.Received,
];
