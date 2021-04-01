import { useMutation } from "@apollo/client";
import TdModal from "common/components/Modal";
import RedErrorMessage from "common/components/RedErrorMessage";
import { NotificationError } from "common/components/Error";
import { formatISO } from "date-fns";
import { Field, Form, Formik } from "formik";
import {
  BsdasriSignatureInput,
  Bsdasri,
  BsdasriStatus,
  BsdasriSignatureType,
} from "generated/graphql/types";
import React from "react";

// import AcceptanceForm from "./signature/AcceptanceForm";
// import OperationForm from "./signature/OperationForm";
// import TransporterForm from "./signature/TransporterForm";
import { gql } from "@apollo/client";

import { fullDasriFragment } from "common/fragments/dasris";

const signatureTypes = {
  [BsdasriStatus.Initial]: {
    type: BsdasriSignatureType.Emission,
    name: "Producteur",
  },
  [BsdasriStatus.SignedByProducer]: {
    type: BsdasriSignatureType.Transport,
    name: "Transporteur",
  },
  [BsdasriStatus.Sent]: {
    type: BsdasriSignatureType.Reception,
    name: "Réception",
  },
  [BsdasriStatus.Received]: {
    type: BsdasriSignatureType.Operation,
    name: "Traitement",
  },
};

type Props = { dasri: Bsdasri; isOpen: boolean; onClose: () => void };

export const DASRI_SIGN = gql`
  mutation DasriSign($id: ID!, $input: BsdasriSignatureInput!) {
    dasriSign(id: $id, signatureInput: $input) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;
export default function DasriSignModal({ dasri, isOpen, onClose }: Props) {
  const signature = signatureTypes[dasri.status];
  const [sign, { error }] = useMutation(DASRI_SIGN);

  //   const additionnalForm = getAdditionalForm(signatureType, form);

  return (
    <TdModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Signer le bordereau VHU"
    >
      <h2 className="td-modal-title">Signature {signature?.name}</h2>
      <p>{dasri.id}</p>
      {/* {additionnalForm && (
        <>
          <h3>Champs obligatoires</h3>
          {additionnalForm}
        </>
      )} */}

      <h3>Signature</h3>
      {error && <NotificationError apolloError={error} />}

      <div>
        <Formik
          initialValues={{
            signedBy: "",
          }}
          onSubmit={async values => {
            try {
              await sign({
                variables: {
                  id: dasri.id,
                  input: {
                    type: signature.type,
                    ...values,
                  },
                },
              });
              onClose();
            } catch (err) {}
          }}
        >
          <Form>
            <div className="form__row">
              <label>
                Signataire
                <Field type="text" name="signedBy" className="td-input" />
              </label>

              <RedErrorMessage name="signedBy" />
            </div>

            <div className="form__actions">
              <button
                type="button"
                className="btn btn--outline-primary"
                onClick={onClose}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn--primary">
                Je signe
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </TdModal>
  );
}

// function getAdditionalForm(type: SignatureTypeInput | null, form: VhuForm) {
//   switch (type) {
//     case SignatureTypeInput.Transporter:
//       return <TransporterForm form={form} />;

//     case SignatureTypeInput.Acceptance:
//       return <AcceptanceForm form={form} />;

//     case SignatureTypeInput.Operation:
//       return <OperationForm form={form} />;

//     case SignatureTypeInput.Emitter:
//     default:
//       return <></>;
//   }
// }
