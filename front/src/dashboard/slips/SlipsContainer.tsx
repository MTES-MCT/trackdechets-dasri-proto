import React from "react";
import Onboarding from "./onboarding/Onboarding";
import BsdHeader from "dashboard/common/header/BsdHeader";
import { BsdTypes } from "common/bsdConstants";
import SlipsContent from "./SlipsContent";

export default function SlipsContainer() {
  return (
    <>
      <BsdHeader bsdType={BsdTypes.FORM} />
      <SlipsContent />
      <Onboarding />
    </>
  );
}
