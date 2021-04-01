import React from "react";
import SortControl from "dashboard/slips/SortableTableHeader";


import { useDasrisTable } from "../dasris/use-dasris-table";

import TransportSignature from "./actions/TransportSignature";
import styles from "./TransportTable.module.scss";

import Shorten from "common/components/Shorten";
import DasriQuicklook from "dashboard/dasris/dasri-actions/DasriQuicklook";
export const TransportTable = ({ forms, userSiret, refetchQuery }) => {
  const [sortedForms, sortParams, sortBy, filter] = useDasrisTable(forms);

  return (
    <table className="td-table transport-table">
      <thead>
        <tr className="td-table__head-tr">
          <SortControl
            sortFunc={sortBy}
            fieldName="readableId"
            caption="Numéro"
            sortParams={sortParams}
          />
          <SortControl
            sortFunc={sortBy}
            fieldName="emitter.company.name"
            caption="Emetteur"
            sortParams={sortParams}
          />
          <SortControl
            sortFunc={sortBy}
            fieldName="stateSummary.recipient.name"
            caption="Destinataire"
            sortParams={sortParams}
          />

          <th>Déchet</th>
          <th className={styles.hideOnMobile}>Quantité estimée</th>

          <th>Action</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedForms.map(form => (
          <tr key={form.id} className="td-table__tr">
            <td>
              <div className={styles.readableId}>{form.id}</div>
            </td>
            <td>
              <Shorten content={form.emitter?.company?.name || ""} />
            </td>
            <td className={styles.hideOnMobile}>
              <Shorten content={form.recipient?.company?.name || ""} />
            </td>
            <td>
              <div>{form?.emission?.wasteCode}</div>
            </td>
            <td className={styles.hideOnMobile}>tonnes</td>

            <td>
              <div className={styles.transportActions}></div>
            </td>
            <td>
              <DasriQuicklook
                formId={form.id}
                buttonClass={`btn--no-style slips-actions__button ${styles.quicklook}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
