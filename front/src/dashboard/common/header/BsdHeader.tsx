import React, { useState, useEffect } from "react";

import routes from "common/routes";
import styles from "./BsdHeader.module.scss";
import { useRouteMatch } from "react-router-dom";
import { BsdTypes } from "common/bsdConstants";
import { FaTimesCircle } from "react-icons/fa";
type headerConfigInterface = {
  [key in BsdTypes]: { name: string; subRoute: string };
};
const headerConfig: headerConfigInterface = {
  [BsdTypes.FORM]: { name: "Bordereaux", subRoute: "slips" },
  [BsdTypes.DASRI]: { name: "Bordereaux Dasri", subRoute: "dasris" },
};

const Crumb = ({ bsdType }: { bsdType: BsdTypes }) => {
  const subRoute = headerConfig[bsdType].subRoute;
  const draft = useRouteMatch(routes.dashboard[subRoute].drafts);
  const act = useRouteMatch(routes.dashboard[subRoute].act);
  const follow = useRouteMatch(routes.dashboard[subRoute].follow);
  const history = useRouteMatch(routes.dashboard[subRoute].history);
  const detail = useRouteMatch(routes.dashboard[subRoute].view);

  return (
    <span>
      {"> "}
      {draft && "Brouillons"}
      {act && "Pour Action"}
      {follow && "Suivi"}
      {history && "Archives"}
      {detail && "Aperçu"}
    </span>
  );
};

export default function BsdHeader({ bsdType }: { bsdType: BsdTypes }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const warningBannerShown = window.localStorage.getItem("td-warningbanner");
    if (!warningBannerShown) {
      setIsOpen(true);
    }
  }, []);
  return (
    <div className={styles.slipsHeader}>
      <div>
        <div className="title">
          <h2 className="h3 tw-mb-4">
            Mes {headerConfig[bsdType].name} <Crumb bsdType={bsdType} />
          </h2>
        </div>
      </div>
      {isOpen && (
        <div className="notification warning tw-flex tw-items-center">
          <p>
            Actuellement, Trackdéchets ne permet pas de prendre en compte les
            déchets d'amiante et les Fluides frigorigènes, ainsi que l'annexe 3
            (Spécifique Véhicules Hors d'Usage) et le multimodal. Merci de votre
            compréhension
          </p>
          <button
            aria-label="Fermer"
            className="tw-border-none tw-bg-transparent"
            onClick={() => {
              window.localStorage.setItem("td-warningbanner", "HIDDEN");
              setIsOpen(false);
            }}
          >
            <FaTimesCircle className="tw-text-2xl tw-ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
