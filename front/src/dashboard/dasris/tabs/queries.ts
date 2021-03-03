import { gql } from "@apollo/client";
import { fullDasriFragment } from "common/fragments/dasris";

export const DASRI_DRAFT_TAB = gql`
  query DasrisGetDraft($siret: String) {
    bsdasris(siret: $siret, status: [DRAFT]) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_ACT_TAB = gql`
  query DasrisGetAct($siret: String) {
    bsdasris(siret: $siret, status: [SEALED, SENT, RECEIVED], hasNextStep: true) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_FOLLOW_TAB = gql`
  query DasrisGetFollow($siret: String) {
    bsdasris(
      siret: $siret
      status: [SENT, RECEIVED, READY_FOR_TAKEOVER]
      hasNextStep: false
    ) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_ARCHIVE_TAB = gql`
  query DasrisGetFollow($siret: String) {
    bsdasris(siret: $siret, status: [PROCESSED, REFUSED]) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;
