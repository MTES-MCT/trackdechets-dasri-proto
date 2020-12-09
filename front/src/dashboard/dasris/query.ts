import { gql } from "@apollo/client";
import { fullDasriFragment } from "common/fragments/dasris";

export const GET_DASRIS = gql`
  query GetDasris {
    dasris {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

 