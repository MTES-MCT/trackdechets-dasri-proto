import { gql } from "@apollo/client";
import { fullFormFragment, statusChangeFragment } from "common/fragments";
import { dasriStatusChangeFragment,   } from "common/fragments/dasris";

const MARK_SEALED = gql`
  mutation MarkAsSealed($id: ID!) {
    markAsSealed(id: $id) {
      ...StatusChange
    }
  }
  ${statusChangeFragment}
`;
const MARK_RECEIVED = gql`
  mutation MarkAsReceived($id: ID!, $info: ReceivedFormInput!) {
    markAsReceived(id: $id, receivedInfo: $info) {
      ...StatusChange
    }
  }
  ${statusChangeFragment}
`;
const MARK_PROCESSED = gql`
  mutation MarkAsProcessed($id: ID!, $info: ProcessedFormInput!) {
    markAsProcessed(id: $id, processedInfo: $info) {
      ...StatusChange
    }
  }
  ${statusChangeFragment}
`;

const MARK_TEMP_STORED = gql`
  mutation MarkAsTempStored($id: ID!, $info: TempStoredFormInput!) {
    markAsTempStored(id: $id, tempStoredInfos: $info) {
      ...StatusChange
    }
  }
  ${statusChangeFragment}
`;

const MARK_RESEALED = gql`
  mutation MarkAsResealed($id: ID!, $info: ResealedFormInput!) {
    markAsResealed(id: $id, resealedInfos: $info) {
      ...StatusChange
    }
  }
  ${statusChangeFragment}
`;

const DUPLICATE_FORM = gql`
  mutation DuplicateForm($id: ID!) {
    duplicateForm(id: $id) {
      ...FullForm
    }
  }
  ${fullFormFragment}
`;

const DELETE_FORM = gql`
  mutation DeleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;
const DASRI_MARK_READY = gql`
  mutation DasriMarkAsReady($id: ID!) {
    dasriMarkAsReady(id: $id) {
      ...StatusChange
    }
  }
  ${dasriStatusChangeFragment}
`
export default {
  form: {
    SEALED: MARK_SEALED,
    RECEIVED: MARK_RECEIVED,
    PROCESSED: MARK_PROCESSED,
    TEMP_STORED: MARK_TEMP_STORED,
    RESEALED: MARK_RESEALED,
    DUPLICATE_FORM,
    DELETE_FORM,
  },
  dasri: {
    SEALED: DASRI_MARK_READY,
    DELETE_FORM: DASRI_MARK_READY
    
    ,
  },
};
