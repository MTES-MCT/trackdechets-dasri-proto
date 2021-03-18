import { gql } from "@apollo/client";

import { fullDasriFragment } from "common/fragments/dasris";

export const DASRI_GET = gql`
  query Bsdasri($id: ID!) {
    bsdasri(id: $id) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export const DASRIS_TRANSPORT_GET = gql`
  query Bsdasris(
    $siret: String
    $status: [BsdasriStatus!]
    $roles: [BsdasriRole!]
  ) {
    bsdasris(siret: $siret, status: $status, roles: $roles) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

 
export const DASRIS_GET = gql`
  query Bsdasris($siret: String, $status: [BsdasriStatus!]) {
    bsdasris(siret: $siret, status: $status) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;
