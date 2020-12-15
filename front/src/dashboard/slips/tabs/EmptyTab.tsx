import React from "react";
import BsdHeaderActions from "dashboard/common/header/BsdHeaderActions";
import { BsdTypes } from "common/bsdConstants";
interface Props {
  children: React.ReactNode;
}

export default function EmptyTab(props: Props) {
  return (
    <div className="empty-tab">
      <BsdHeaderActions bsdType={BsdTypes.FORM}/>
      {props.children}
    </div>
  );
}
