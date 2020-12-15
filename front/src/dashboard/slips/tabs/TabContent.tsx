import React from "react";

import { RefreshLoader } from "common/components/Loaders";

import LoadMore from "./LoadMore";
import BsdHeaderActions from "dashboard/common/header/BsdHeaderActions";
import { BsdTypes } from "common/bsdConstants";
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
      <BsdHeaderActions refetch={refetch} bsdType={BsdTypes.FORM} />
      {children}
      <LoadMore forms={forms} fetchMore={fetchMore} />
    </>
  );
}
