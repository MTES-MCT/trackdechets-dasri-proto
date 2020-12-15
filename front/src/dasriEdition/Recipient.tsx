import { Field, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import RedErrorMessage from "common/components/RedErrorMessage";
import CompanySelector from "../form/company/CompanySelector";
import DateInput from "../form/custom-inputs/DateInput";
import initialState from "./dasri-initial-state";
import { Form } from "generated/graphql/types";
// import ProcessingOperation from "./processing-operation/ProcessingOperation";

import TdSwitch from "../common/components/Switch";

import styles from "./Recipient.module.scss";
import classNames from "classnames";

export default function Recipient() {
  const { values, setFieldValue } = useFormikContext<Form>();

  return (
    <>
     

      <h4 className="form__section-heading">
        Installation{" "}
        {values.recipient?.isTempStorage
          ? "d'entreposage ou de reconditionnement"
          : "de destination"}
      </h4>

      <CompanySelector name="recipient.company" />
    </>
  );
}
