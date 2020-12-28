import React from "react";

import { RefreshLoader } from "common/components/Loaders";
import { BsdTypes } from "common/bsdConstants";
import BsdHeaderActions from "dashboard/common/header/BsdHeaderActions";

// import LoadMore from "./LoadMore";
 

export default function TabContent({
  forms,
  networkStatus,
  refetch,
  fetchMore,
  children,
}) {
  return (
    <>
      <RefreshLoader networkStatus={networkStatus} />
  
      <BsdHeaderActions refetch={refetch} bsdType={BsdTypes.DASRI} />

      {children}
      {/* <LoadMore forms={forms} fetchMore={fetchMore} /> */}
    </>
  );
}
