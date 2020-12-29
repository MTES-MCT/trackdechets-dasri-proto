import React from "react";

import { BsdActions } from "common/bsd-actions/BsdActions";

import { statusLabels } from "../constants";
import Shorten from "common/components/Shorten";
import { Dasri } from "generated/graphql/types";
import "./Dasris.scss";

type Props = {
  dasris: Dasri[];
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
            <th>
              <span>Emetteur</span>
            </th>
            <th>
              <span>Destinataire</span>
            </th>
            <th>
              <span>Déchet</span>
            </th>

            <th>Quantité</th>

            {dynamicActions && <th>Mes actions</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dasris.map((s: Dasri) => (
            <tr key={s.id} className="td-table__tr">
              {hiddenFields.indexOf("readableId") === -1 && (
                <td>
                  <div className="id">{s.readableId}</div>
                </td>
              )}
              {hiddenFields.indexOf("sentAt") === -1 && (
                <td>
                  {/* {!!s.sentAt && DateTime.fromISO(s.sentAt).toLocaleString()} */}
                </td>
              )}

              <td>
                <Shorten content={s?.emitter?.company?.name || ""} />
              </td>
              <td>
                <Shorten content={s?.recipient?.company?.name || ""} />
              </td>
              <td>
                {s?.emission?.wasteCode && (
                  <>
                    <div>{s.emission.wasteCode}</div>
                  </>
                )}
              </td>
              <td>
                {" "}
                {s?.emission?.wasteDetails?.volume && (
                  <>
                    <div>{s?.emission?.wasteDetails?.volume} L</div>
                  </>
                )}
              </td>
              {hiddenFields.indexOf("status") === -1 && (
                <td>{statusLabels[s.status]}</td>
              )}

              {dynamicActions && <td></td>}
              <td>
                {" "}
                <BsdActions
                  bsdType="dasri"
                  bsdId={s.id}
                  bsdStatus={s.status}
                  siret={siret}
                />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
