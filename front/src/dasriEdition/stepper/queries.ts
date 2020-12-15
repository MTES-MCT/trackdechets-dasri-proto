import { gql } from "@apollo/client";

import { fullDasriFragment } from "common/fragments/dasris";

export const DASRIS_GET = gql`
  query DasrisGet {
    dasris {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_GET = gql`
  query DasrisGet($id: ID) {
    dasri(id: $id) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRI_CREATE = gql`
  mutation DasriCreate($dasriCreateInput: DasriCreateInput!) {
    dasriCreate(dasriCreateInput: $dasriCreateInput) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;
export const DASRI_UPDATE = gql`
  mutation DasriUpdate($dasriUpdateInput: DasriUpdateInput!) {
    dasriUpdate(dasriUpdateInput: $dasriUpdateInput) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;
