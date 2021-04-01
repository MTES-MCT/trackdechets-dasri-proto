import { gql } from "@apollo/client";
import { fullDasriFragment } from "common/fragments/dasris";

export const DASRI_DRAFT_TAB = gql`
  query DasrisGetDraft($siret: String) {
    bsdasris(siret: $siret, where: { status: INITIAL }) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FullDasri
        }
      }
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_ACT_TAB = gql`
  query DasrisGetAct($siret: String) {
    bsdasris(
      siret: $siret
      where: {
        _or: [{ status: INITIAL }, { status: SENT }, { status: RECEIVED }]
      }
    ) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FullDasri
        }
      }
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_FOLLOW_TAB = gql`
  query DasrisGetFollow($siret: String) {
    bsdasris(
      siret: $siret

      where: {
        _or: [
          { status: SENT }
          { status: RECEIVED }
          { status: SIGNED_BY_PRODUCER }
        ]
      }
    ) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FullDasri
        }
      }
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_ARCHIVE_TAB = gql`
  query DasrisGetFollow($siret: String) {
    bsdasris(
      siret: $siret
      where: {
        _or: [{ status: SENT }, { status: PROCESSED }, { status: REFUSED }]
      }
    ) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FullDasri
        }
      }
    }
  }
  ${fullDasriFragment}
`;
