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
  fragment TransporterFragment on BsdasriTransporter {
    receipt
    receiptDepartment
    receiptValidityLimit

    company {
      ...CompanyFragment
    }
  }
  ${companyFragment}
`;

export const transportFragment = gql`
  fragment TransportFragment on BsdasriTransport {
    handedOverAt
    takenOverAt
    wasteDetails {
      quantity
      quantityType
      volume
      onuCode
      packagingInfos {
        type
        other
        quantity
        volume
      }
    }
    wasteAcceptation {
      status
      refusalReason
      refusedQuantity
    }
    
    signedBy
    signedAt
  }
`;

const emitterFragment = gql`
  fragment EmitterFragment on BsdasriEmitter {
    company {
      ...CompanyFragment
    }
  }
  ${companyFragment}
`;
const emissionFragment = gql`
  fragment EmissionFragment on BsdasriEmission {
    wasteCode

    wasteDetails {
      quantity
      quantityType
      volume
      onuCode
      packagingInfos {
        type
        other
        quantity
        volume
      }
    }
    signedBy
    signedAt
  }
`;
const recipientFragment = gql`
  fragment RecipientFragment on BsdasriRecipient {
    company {
      ...CompanyFragment
      
    }
  }
  ${companyFragment}
`;
const receptionFragment = gql`
  fragment ReceptionFragment on BsdasriReception {
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
    wasteAcceptation {
      status
      refusalReason
      refusedQuantity
    }
    receivedAt
    signedBy
    signedAt
  }
`;
const operationFragment = gql`
  fragment OperationFragment on BsdasriOperation {
    processingOperation
    processedAt
    signedBy
    signedAt
  }
`;
const mutableDasriFieldsFragment = gql`
  fragment MutableDasriFieldsFragment on Bsdasri {
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
      ...TransportFragment
    }
    recipient {
      ...RecipientFragment
    }
    reception {
      ...ReceptionFragment
    }
    operation {
      ...OperationFragment
    }
  }
  ${emitterFragment}
  ${emissionFragment}
  ${transporterFragment}
  ${transportFragment}
  ${recipientFragment}
  ${receptionFragment}
  ${operationFragment}
`;

export const fullDasriFragment = gql`
  fragment FullDasri on Bsdasri {
    ...MutableDasriFieldsFragment
  }
  ${mutableDasriFieldsFragment}
`;

export const dasriStatusChangeFragment = gql`
  fragment StatusChange on Bsdasri {
    id
    status
  }
`;
