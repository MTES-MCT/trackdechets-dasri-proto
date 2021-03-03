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
import { BsdActionProps } from "./DasriActions";

const signatureTypes = {
  [BsdasriStatus.Sealed]: {
    type: BsdasriSignatureType.Emission,
    name: "Producteur",
  },
  [BsdasriStatus.ReadyForTakeover]: {
    type: BsdasriSignatureType.Transport,
    name: "Transporteur",
  },
  [BsdasriStatus.Sent]: { type: BsdasriSignatureType.Reception, name: "Réception" },
  [BsdasriStatus.Received]: {
    type: BsdasriSignatureType.Operation,
    name: "Traitement",
  },
};

type Props = { dasri: Bsdasri };

export const DASRI_SIGN = gql`
  mutation DasriSign($id: ID!, $input: BsdasriSignatureInput!) {
    dasriSign(id: $id, signatureInput: $input) {
      ...FullDasri
    }
  }
  ${fullDasriFragment}
`;

export default function DasriSignature({
  dasri,
  onCancel,
  onSubmit,
}: BsdActionProps) {
  const signature = signatureTypes[dasri.status];
  const [sign, { error }] = useMutation(DASRI_SIGN);

  //   const additionnalForm = getAdditionalForm(signatureType, form);

  return (
    <div>
       <h3>Bordereau {dasri.readableId}</h3>

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
              onCancel();
            } catch (err) {}
          }}
        >
          <Form>
            <div className="form__row">
              <label>
                Nom du Signataire
                <Field type="text" name="signedBy" className="td-input" />
              </label>

              <RedErrorMessage name="signedBy" />
            </div>

            <div className="form__actions">
              <button
                type="button"
                className="btn btn--outline-primary"
                onClick={onCancel}
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
    </div>
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
