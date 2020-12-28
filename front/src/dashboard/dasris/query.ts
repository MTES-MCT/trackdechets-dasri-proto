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

 