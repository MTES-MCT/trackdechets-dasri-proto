import React from "react";
import CompanySelector from "../form/company/CompanySelector";
import { Field, connect } from "formik";
import RedErrorMessage from "common/components/RedErrorMessage";
import DateInput from "../form/custom-inputs/DateInput";
import Packagings from "./packagings/Packagings";
import { RadioButton } from "../form/custom-inputs/RadioButton";
import NumberInput from "../form/custom-inputs/NumberInput";

import styles from "./Transporter.module.scss";

export default connect<{}>(function Transporter(props) {
  return (
    <>
      <h4 className="form__section-heading">Transporteur</h4>
      <CompanySelector
        name="transporter.company"
        onCompanySelected={transporter => {
          if (transporter.transporterReceipt) {
            props.formik.setFieldValue(
              "transporter.receipt",
              transporter.transporterReceipt.receiptNumber
            );
            props.formik.setFieldValue(
              "transporter.receiptValidityLimit",
              transporter.transporterReceipt.validityLimit
            );
            props.formik.setFieldValue(
              "transporter.receiptDepartment",
              transporter.transporterReceipt.department
            );
          } else {
            props.formik.setFieldValue("transporter.receipt", "");
            props.formik.setFieldValue(
              "transporter.receiptValidityLimit",
              null
            );
            props.formik.setFieldValue("transporter.receiptDepartment", "");
          }
        }}
      />

      <h4 className="form__section-heading">Autorisations</h4>

      <div className="form__row">
        <label>
          Numéro de récépissé
          <Field type="text" name="transporter.receipt" className="td-input" />
        </label>

        <RedErrorMessage name="transporter.receipt" />

        <label>
          Département
          <Field
            type="text"
            name="transporter.receiptDepartment"
            placeholder="Ex: 83"
            className={`td-input ${styles.transporterDepartment}`}
          />
        </label>

        <RedErrorMessage name="transporter.department" />

        <label>
          Limite de validité (optionnel)
          <Field
            component={DateInput}
            name="transporter.receiptValidityLimit"
            className={`td-input ${styles.transporterValidityLimit}`}
          />
        </label>

        <RedErrorMessage name="transporter.validityLimit" />
      </div>
      <div className="form__row">
        <h4 className="form__section-heading">Conditionnement</h4>
        <label>
          <Field
            component={NumberInput}
            name="transport.wasteDetails.quantity"
            className="td-input waste-details__quantity"
            placeholder="En kg"
            min="0"
            step="1"
          />
          <span className="tw-ml-2">KiloGrammes</span>
        </label>
        <RedErrorMessage name="transport.wasteDetails.quantity" />

        <fieldset className="tw-mt-3">
          <legend>Cette quantité est</legend>
          <Field
            name="transport.wasteDetails.quantityType"
            id="REAL"
            label="Réelle"
            component={RadioButton}
          />
          <Field
            name="transport.wasteDetails.quantityType"
            id="ESTIMATED"
            label="Estimée"
            component={RadioButton}
          />
        </fieldset>
        <Field
          name="transport.wasteDetails.packagingInfos"
          component={Packagings}
        />
      </div>
      <div className="form__row">
        <h4 className="form__section-heading">Lot accepté</h4>
        <fieldset className="tw-mt-3">
          <legend>Lot accepté</legend>
          <Field
            name="transport.wasteAcceptation.status"
            id="ACCEPTED"
            label="Oui"
            component={RadioButton}
          />
          <Field
            name="transport.wasteAcceptation.status"
            id="REFUSED"
            label="Non"
            component={RadioButton}
          />
           <Field
            name="transport.wasteAcceptation.status"
            id="PARTIALLY_REFUSED"
            label="Partiellement"
            component={RadioButton}
          />
        </fieldset>

        <label>
          <span>Quantité refusée</span>
          <Field
            component={NumberInput}
            name="transport.wasteDetails.refusedQuantity"
            className="td-input waste-details__quantity"
            placeholder="En kg"
            min="0"
            step="1"
          />
          <span className="tw-ml-2">KiloGrammes</span>
        </label>
        <RedErrorMessage name="transport.wasteDetails.refusedQuantity" />
        <label>
          Motif de refus
          <Field type="text" name="transporter.wasteDetails.refusalReason" className="td-input" />
        </label>

        <RedErrorMessage name="transporter.wasteDetails.refusalReason" />
      </div>
    </>
  );
});
