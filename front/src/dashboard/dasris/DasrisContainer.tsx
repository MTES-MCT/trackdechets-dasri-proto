import React from "react";

import DasrisContent from "./DasrisContent";
import BsdHeader from "dashboard/common/header/BsdHeader";
import { BsdTypes } from "common/bsdConstants";

export default function DasriContainer() {
  return (
    <>
 
      <BsdHeader bsdType={BsdTypes.DASRI} />
      <DasrisContent />
    </>
  );
}
