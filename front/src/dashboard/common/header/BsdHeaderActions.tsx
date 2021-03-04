import React from "react";
import { generatePath, Link, useParams } from "react-router-dom";
import { RefreshIcon } from "common/components/Icons";
import styles from "./BsdHeaderActions.module.scss";
import routes from "common/routes";
import { BsdTypes } from "common/bsdConstants";

type actionConfigInterface = {
  [key in BsdTypes]: { bsdName: string; createRoute: string };
};
const actionConfig: actionConfigInterface = {
  [BsdTypes.FORM]: {
    bsdName: "Bordereau",
    createRoute: routes.dashboard.slips.create,
  },
  [BsdTypes.DASRI]: {
    bsdName: "Dasri",
    createRoute: routes.dashboard.dasris.create,
  },
};

export default function BsdHeaderActions({
  bsdType,
  refetch,
  showCreate  ,
}: {
  bsdType: BsdTypes;
  refetch?: () => void;
  showCreate?: boolean;
}) {
  const { siret } = useParams<{ siret: string }>();
  const config = actionConfig[bsdType];
  return (
    <div className={styles.slipHeaderActions}>
      {!!showCreate && (
        <Link
          to={generatePath(config.createRoute, { siret })}
          className="btn btn--primary"
        >
          Créer un {config.bsdName}
        </Link>
      )}
      {!!refetch && (
        <button
          className={`btn btn--primary ${styles.refreshButton}`}
          onClick={() => refetch()}
        >
          <span>Rafraîchir</span>
          <RefreshIcon />
        </button>
      )}
    </div>
  );
}
