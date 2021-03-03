import React from "react";

import { Field, connect } from "formik";

import { RadioButton } from "../form/custom-inputs/RadioButton";
import NumberInput from "../form/custom-inputs/NumberInput";
import Packagings from "./packagings/Packagings";
import RedErrorMessage from "../common/components/RedErrorMessage";

 
import "../form/WasteInfo.scss";
 

type Values = {
  wasteDetails: { code: string; packagings: string[] };
  emitter: { company: { siret: string }; type: string };
};
export default connect<{}, Values>(function DasriWasteDetail(props) {
  const values = props.formik.values;

    // if (!values.wasteDetails.packagings) {
    //   values.wasteDetails.packagings = [];
    // }

  return (
    <>
      <h4 className="form__section-heading">Description du déchet</h4>

      <div className="form__row">
        <fieldset>
          <legend className="tw-font-semibold">Code déchet</legend>
          <Field
            name="emission.wasteCode"
            id="18 01 03*"
            label="DASRI d'origine humaine (18 01 03*)"
            component={RadioButton}
          />
          <Field
            name="emission.wasteCode"
            id="18 01 02*"
            label="DASRI d'origine animale (18 01 02*)"
            component={RadioButton}
          />
        </fieldset>
      </div>

      <h4 className="form__section-heading">Conditionnement</h4>

      <Field
        name="emission.wasteDetails.packagingInfos"
        component={Packagings}
      />

      <h4 className="form__section-heading">Quantité en kg</h4>
      <div className="form__row">
        <label>
          <Field
            component={NumberInput}
            name="emission.wasteDetails.quantity"
            className="td-input waste-details__quantity"
            placeholder="En kg"
            min="0"
            step="1"
          />
          <span className="tw-ml-2">KiloGrammes</span>
        </label>
        <RedErrorMessage name="emission.wasteDetails.quantity" />

        <fieldset className="tw-mt-3">
          <legend>Cette quantité est</legend>
          <Field
            name="emission.wasteDetails.quantityType"
            id="REAL"
            label="Réelle"
            component={RadioButton}
          />
          <Field
            name="emission.wasteDetails.quantityType"
            id="ESTIMATED"
            label="Estimée"
            component={RadioButton}
          />
        </fieldset>

        <RedErrorMessage name="emission.wasteDetails.quantityType" />
      </div>
      <div className="form__row">
        <label>
          Mentions au titre de l'ADR
          <Field
            type="text"
            name="emission.wasteDetails.onuCode"
            className="td-input"
          />
        </label>

        <RedErrorMessage name="emission.wasteDetails.onuCode" />
      </div>
    </>
  );
});
