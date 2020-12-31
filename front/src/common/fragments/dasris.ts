import { gql } from "@apollo/client";

export const companyFragment = gql`
  fragment CompanyFragment on FormCompany {
    name
    siret
    address
    contact
    country
    phone
    mail
  }
`;
export const wasteDetailsFragment = gql`
  fragment WasteDetailsFragment on WasteDetails {
    code
    name
    onuCode
    packagingInfos {
      type
      other
      quantity
    }
    quantity
    quantityType
  }
`;

export const transporterFragment = gql`
  fragment TransporterFragment on DasriTransporter {
    receipt
    department
    validityLimit

    company {
      ...CompanyFragment
    }
  }
  ${companyFragment}
`;

export const transportFragment = gql`
  fragment TransportFragment on DasriTransport {
    handedOverAt
    takenOverAt
  }
`;

const emitterFragment = gql`
  fragment EmitterFragment on DasriEmitter {
    company {
      ...CompanyFragment
    }
  }
  ${companyFragment}
`;
const emissionFragment = gql`
  fragment EmissionFragment on DasriEmission {
    wasteCode
    wasteDetailsOnuCode
    wasteDetails {
      quantity
      quantityType
      volume
      packagingInfos {
        type
        other
        quantity
        volume
      }
    }
  }
`;
const recipientFragment = gql`
  fragment RecipientFragment on DasriRecipient {
    company {
      ...CompanyFragment
    }
  }
  ${companyFragment}
`;

const mutableDasriFieldsFragment = gql`
  fragment MutableDasriFieldsFragment on Dasri {
    id
    readableId
    status
    emitter {
      ...EmitterFragment
    }
    emission {
      ...EmissionFragment
    }
    transporter {
      ...TransporterFragment
    }
    transport {
      ... TransportFragment
    }
    recipient {
      ...RecipientFragment
    }
  }
  ${emitterFragment}
  ${emissionFragment}
  ${transporterFragment}
  ${transportFragment}
  ${recipientFragment}
`;

export const fullDasriFragment = gql`
  fragment FullDasri on Dasri {
    ...MutableDasriFieldsFragment
  }
  ${mutableDasriFieldsFragment}
`;

export const dasriStatusChangeFragment = gql`
  fragment StatusChange on Dasri {
    id
    status
  }
`;
