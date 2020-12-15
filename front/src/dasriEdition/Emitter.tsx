import { Field, useFormikContext } from "formik";
import React, { useState, useEffect } from "react";
import CompanySelector from "../form/company/CompanySelector";
import { RadioButton } from "../form/custom-inputs/RadioButton";
import "./Emitter.scss";
import { Dasri } from "generated/graphql/types";
import WorkSite from "common/components/worksite/WorkSite";
 

export default function Emitter() {
  const { values, setFieldValue } = useFormikContext<Dasri>();

  return (
    <>
      <div className="form__row">
        <label htmlFor="id_customId">Autre Numéro Libre (optionnel)</label>
        <Field
          id="id_customId"
          type="text"
          className="td-input"
          placeholder="Utilisez votre propre numéro de BSD si nécessaire."
          name="customId"
        />
      </div>

     

      <CompanySelector name="emitter.company" heading="Entreprise émettrice" />

     <WorkSite  bsdType="dasri" />  
      
    </>
  );
}
