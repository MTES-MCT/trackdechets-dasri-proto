import { gql } from "@apollo/client";
import { fullDasriFragment } from "common/fragments/dasris";

 
export const DASRI_DRAFT_TAB = gql`
  query DasrisGetDraft($siret: String) {
    dasris(siret: $siret, status: [DRAFT]) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_ACT_TAB = gql`
  query DasrisGetAct($siret: String) {
    dasris(siret: $siret, status: [SEALED, RECEIVED]) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_FOLLOW_TAB = gql`
  query DasrisGetFollow($siret: String) {
    dasris(siret: $siret, status: [SENT, RECEIVED, READY_FOR_TAKEOVER]) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_ARCHIVE_TAB = gql`
  query DasrisGetFollow($siret: String) {
    dasris(siret: $siret, status: [PROCESSED, REFUSED]) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;
