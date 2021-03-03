import React from "react";
import CompanySelector from "../form/company/CompanySelector";
import Packagings from "./packagings/Packagings";
import { Field, connect } from "formik";

export default connect<{}>( function Recipient() {
  return (
    <>
      <h4 className="form__section-heading">Installation de destination</h4>

      <CompanySelector name="recipient.company" />

      <div className="form__row">
        <h4 className="form__section-heading">Conditionnement</h4>
        <Field
          name="reception.wasteDetails.packagingInfos"
          component={Packagings}
        />
      </div>
    </>
  );
});
