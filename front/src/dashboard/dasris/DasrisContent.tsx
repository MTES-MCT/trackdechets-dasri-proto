import React from "react";
import {
  Redirect,
  Route,
  Switch,
  generatePath,
  useParams,
} from "react-router-dom";

import routes from "common/routes";
// import "./SlipsContent.scss";
// import ActTab from "./tabs/ActTab";
import DraftsTab from "./tabs/DraftsTab";
// import FollowTab from "./tabs/FollowTab";
// import HistoryTab from "./tabs/HistoryTab";
// import SlipDetail from "../slip/SlipDetail";

export default function DasrisContent() {
  const { siret } = useParams<{ siret: string }>();

  return (
    <div>
      <DraftsTab />
    </div>
  );
}
