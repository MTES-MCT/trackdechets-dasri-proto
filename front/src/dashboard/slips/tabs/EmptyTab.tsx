import React from "react";
import BsdHeaderActions from "dashboard/common/header/BsdHeaderActions";
import { BsdTypes } from "common/bsdConstants";
interface Props {
  children: React.ReactNode;
  bsdType: BsdTypes;
}

export default function EmptyTab(props: Props) {
  return (
    <div className="empty-tab">
      <BsdHeaderActions bsdType={props.bsdType}/>
      {props.children}
    </div>
  );
}
