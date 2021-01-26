import React from "react";
import CompanySelector from "../form/company/CompanySelector";
import { Field, connect } from "formik";
import RedErrorMessage from "common/components/RedErrorMessage";
import DateInput from "../form/custom-inputs/DateInput";
 

import styles from "./Transporter.module.scss";
type Values = {
  transporter: { isExemptedOfReceipt: boolean };
};
export default connect<{}, Values>(function Transporter(props) {
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
            props.formik.setFieldValue("transporter.receiptValidityLimit", null);
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
            name="transporter.department"
            placeholder="Ex: 83"
            className={`td-input ${styles.transporterDepartment}`}
          />
        </label>

        <RedErrorMessage name="transporter.department" />

        <label>
          Limite de validité (optionnel)
          <Field
            component={DateInput}
            name="transporter.validityLimit"
            className={`td-input ${styles.transporterValidityLimit}`}
          />
        </label>

        <RedErrorMessage name="transporter.validityLimit" />
      </div>
    </>
  );
});
