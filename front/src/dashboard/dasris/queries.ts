import { gql } from "@apollo/client";

import { fullDasriFragment } from "common/fragments/dasris";

export const DASRI_GET = gql`
  query dasri($id: ID!) {
    dasri(id: $id) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRIS_TRANSPORT_GET = gql`
  query DasrisGet(
    $siret: String
    $status: [BsdasriStatus!]
    $roles: [BsdasriRole!]
  ) {
    dasris(siret: $siret, status: $status, roles: $roles) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

 
export const DASRIS_GET = gql`
  query DasrisGet($siret: String, $status: [BsdasriStatus!]) {
    dasris(siret: $siret, status: $status) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;
