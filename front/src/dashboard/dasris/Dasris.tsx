import React from "react";

import { BsdasriActions } from "dashboard/dasris/dasri-actions/DasriActions";
import { DateTime } from "luxon";
import { statusLabels } from "./constants";
import Shorten from "common/components/Shorten";

import { Bsdasri, BsdasriEdge } from "generated/graphql/types";
import "./Dasris.scss";

type Props = {
  dasris: BsdasriEdge[];
  siret: string;
  hiddenFields?: string[];
  dynamicActions?: boolean;
  refetch?: () => void;
};
export default function Dasris({
  dasris,
  siret,
  hiddenFields = [],
  dynamicActions = false,
  refetch,
}: Props) {
  return (
    <div className="td-table-wrapper">
      <table className="td-table">
        <thead>
          <tr className="td-table__head-tr">
            {hiddenFields.indexOf("readableId") === -1 && <th>Numéro</th>}
            {hiddenFields.indexOf("sentAt") === -1 && (
              <th>Date d'enlèvement</th>
            )}
            <th>
              <span>Emetteur</span>
            </th>
            <th>
              <span>Destinataire</span>
            </th>
            <th>
              <span>Déchet</span>
            </th>

            <th>Volume</th>

            {hiddenFields.indexOf("status") === -1 && <th>Statut</th>}

            {dynamicActions && <th>Mes actions</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dasris.map((s: BsdasriEdge) => (
            <tr key={s.node.id} className="td-table__tr">
              {hiddenFields.indexOf("readableId") === -1 && (
                <td>
                  <div className="id">{s.node.id}</div>
                </td>
              )}
              {hiddenFields.indexOf("sentAt") === -1 && (
                <td>
                  {!!s.node.transport?.takenOverAt &&
                    DateTime.fromISO(s.node.transport.takenOverAt).toLocaleString()}
                </td>
              )}

              <td>
                <Shorten content={s?.node?.emitter?.company?.name || ""} />
              </td>
              <td>
                <Shorten content={s?.node?.recipient?.company?.name || ""} />
              </td>
              <td>
                {s?.node?.emission?.wasteCode && (
                  <>
                    <div>{s.node.emission.wasteCode}</div>
                  </>
                )}
              </td>
              <td>
                {" "}
                {s?.node?.emission?.wasteDetails?.volume && (
                  <>
                    <div>{s.node.emission.wasteDetails?.volume} L</div>
                  </>
                )}
              </td>
              {hiddenFields.indexOf("status") === -1 && (
                <td>{statusLabels[s.node.status]}</td>
              )}

              {dynamicActions && (
                <td>
                  {/* <DasriDynamicActions dasri={s} siret={siret} />{" "} */}
                </td>
              )}
              <td>
                {" "}
                <BsdasriActions
                  bsdasriId={s.node.id}
                  bsdStatus={s.node.status}
                  siret={siret}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
