import React from "react";
import { DateTime } from "luxon";
// import { SlipActions, DynamicActions } from "./slips-actions/SlipActions";
import { useDasrisTable } from "./use-dasris-table";
import SortControl from "../slips/SortableTableHeader";
import { statusLabels } from "../constants";
import Shorten from "common/components/Shorten";
import { Dasri } from "generated/graphql/types";
import "./Dasris.scss";
import Edit from "./actions/Edit"
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
  const [sortedForms, sortParams, sortBy, filter] = useDasrisTable(dasris);
  return (
    <div className="td-table-wrapper">
      <table className="td-table">
        <thead>
          <tr className="td-table__head-tr">
            {hiddenFields.indexOf("readableId") === -1 && <th>Numéro</th>}

            {/* {hiddenFields.indexOf("sentAt") === -1 && (
              <SortControl
                sortFunc={sortBy}
                fieldName="sentAt"
                sortParams={sortParams}
                caption="Date d'enlèvement"
              />
            )} */}

            <SortControl
              sortFunc={sortBy}
              fieldName="emitter.company.name"
              sortParams={sortParams}
              caption="Emetteur"
            />

            <SortControl
              sortFunc={sortBy}
              fieldName="recipient.company.name"
              sortParams={sortParams}
              caption="Destinataire"
            />

            <SortControl
              sortFunc={sortBy}
              fieldName="emission.wasteDetails.code"
              sortParams={sortParams}
              caption="Déchet"
            />

            <th>Quantité</th>
            {/* {hiddenFields.indexOf("status") === -1 && (
              <SortControl
                sortFunc={sortBy}
                fieldName="status"
                sortParams={sortParams}
                caption="Statut"
              />
            )} */}
            {dynamicActions && <th>Mes actions</th>}
            <th></th>
          </tr>
          <tr className=" td-table__head-tr td-table__tr">
            {hiddenFields.indexOf("readableId") === -1 && (
              <th>
                {/* <input
                  type="text"
                  onChange={e => filter("readableId", e.target.value)}
                  className="td-input"
                  placeholder="Filtrer..."
                /> */}
              </th>
            )}

            {hiddenFields.indexOf("sentAt") === -1 && <th></th>}
            <th>
              {/* <input
                type="text"
                onChange={e => filter("emitter.company.name", e.target.value)}
                className="td-input"
                placeholder="Filtrer..."
              /> */}
            </th>
            <th>
              {/* <input
                type="text"
                onChange={e =>
                  filter("stateSummary.recipient.name", e.target.value)
                }
                className="td-input"
                placeholder="Filtrer..."
              /> */}
            </th>
            <th>
              {/* <input
                type="text"
                onChange={e => filter("wasteDetails.code", e.target.value)}
                className="td-input"
                placeholder="Filtrer..."
              /> */}
            </th>
            <th />
            {hiddenFields.indexOf("status") === -1 && <th />}
            <th />
            {dynamicActions && <th></th>}
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
              <td> {s?.emission?.wasteDetails?.volume && (
                  <>
                    <div>{s?.emission?.wasteDetails?.volume} L</div>
                  </>
                )}</td>
              {hiddenFields.indexOf("status") === -1 && (
                <td>{statusLabels[s.status]}</td>
              )}

              <Edit bsdId={s.id} /> 
              {dynamicActions && (
                <td>
                  {/* <DynamicActions siret={siret} form={s} refetch={refetch} /> */}
                </td>
              )}
              <td>{/* <SlipActions form={s} siret={siret} /> */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
