import React from "react";
import {
  Redirect,
  Route,
  Switch,
  generatePath,
  useParams,
} from "react-router-dom";

import routes from "common/routes";

import ActTab from "./tabs/ActTab";
import DraftsTab from "./tabs/DraftsTab";
import FollowTab from "./tabs/FollowTab";
import HistoryTab from "./tabs/HistoryTab";

export default function DasrisContent() {
  const { siret } = useParams<{ siret: string }>();

  return (
    <div>
      <Switch>
        <Route path={routes.dashboard.dasris.drafts}>
          <DraftsTab />
        </Route>
        <Route path={routes.dashboard.dasris.act}>
          <ActTab />
        </Route>
        <Route path={routes.dashboard.dasris.follow}>
          <FollowTab />
        </Route>
        <Route path={routes.dashboard.dasris.history}>
          <HistoryTab />
        </Route>
        <Redirect
          to={generatePath(routes.dashboard.dasris.drafts, {
            siret,
          })}
        />
      </Switch>
    </div>
  );
}
