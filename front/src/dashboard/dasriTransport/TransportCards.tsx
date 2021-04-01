import React from "react";

import DasriQuicklook from "dashboard/dasris/dasri-actions/DasriQuicklook";

import TransportSignature from "./actions/TransportSignature";
import { useDasrisTable } from "../dasris/use-dasris-table";

import styles from "./TransportCards.module.scss";
export const TransportCards = ({ forms, userSiret, refetchQuery }) => {
  const [sortedForms] = useDasrisTable(forms);
  return (
    <ul className={styles.transportCards}>
      {sortedForms.map(form => (
        <li key={form.id} className={styles.transportCard}>
          <div className={styles.detailRow}>
            <dt>Bordereau</dt>
            <dd>{form.id}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>PRED</dt>
            <dd>{form?.emitter?.company?.name} </dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Destinataire</dt>
            <dd>{form?.recipient?.company?.name} </dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Déchet</dt>
            <dd>{form?.emission?.wasteCode}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Volume Pred</dt>
            <dd>{form.emission?.wasteDetails?.volume} l</dd>
          </div>
         
         

          <div className={styles.cardActions}>
            <DasriQuicklook
              formId={form.id}
              buttonClass={`btn btn--no-style ${styles.cardActionsButton}`}
            />
            {/* <TransportSignature
              form={form}
              userSiret={userSiret}
              inCard={true}
            /> */}
          </div>
        </li>
      ))}
    </ul>
  );
};
