import React from "react";

// import DownloadPdf from "dashboard/slips/slips-actions/DownloadPdf";
// import Duplicate from "dashboard/slips/slips-actions/Duplicate";

// import Delete from "dashboard/slips/slips-actions/Delete";
// import Edit from "dashboard/slips/slips-actions/Edit";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Bsdasri, FormCompany } from "generated/graphql/types";
import {  statusLabels } from "../constants";
import {
  WarehouseDeliveryIcon,
  WarehouseStorageIcon,
  WaterDamIcon,
  RenewableEnergyEarthIcon,
  WarehousePackageIcon,
} from "common/components/Icons";

import QRCodeIcon from "react-qr-code";
import { DynamicActions } from "../slips/slips-actions/SlipActions";

import styles from "dashboard/slip/Slip.module.scss";
import { getVerboseQuantityType } from "dashboard/slip/utils";
import { DateRow, DetailRow, YesNoRow, PackagingRow } from "../slip/Components";
import { useParams } from "react-router-dom";

type CompanyProps = {
  company?: FormCompany | null;
  label: string;
};
const Company = ({ company, label }: CompanyProps) => (
  <>
    <dt>{label}</dt> <dd>{company?.name}</dd>
    <dt>Siret</dt> <dd>{company?.siret}</dd>
    <dt>Adresse</dt> <dd>{company?.address}</dd>
    <dt>Tél</dt> <dd>{company?.phone}</dd>
    <dt>Mél</dt> <dd>{company?.mail}</dd>
    <dt>Contact</dt> <dd>{company?.contact}</dd>
  </>
);

type SlipDetailContentProps = {
  form: Bsdasri | null | undefined;
  children?: React.ReactNode;
  refetch?: () => void;
};

/**
 * Handle recipient or destination in case of temp storage
 */
const Recipient = ({ form }: { form: Bsdasri }) => {
  const { recipient, reception, operation } = form;

  return (
    <>
      {" "}
      <div className={styles.detailGrid}>
        <Company label="Destinataire" company={recipient?.company} />
      </div>
      <div className={styles.detailGrid}>
        {/* <dt>Numéro de CAP</dt> <dd>{recipient?.cap}</dd> */}
        {/* <DateRow value={form.receivedAt} label="Reçu le" /> */}
        {/* <DetailRow value={form.receivedBy} label="Reçu par" /> */}

        <DetailRow
          value={form.reception?.signedBy}
          label="Réception signée par"
        />
        <DateRow
          value={form.reception?.signedAt}
          label="Réception signée  le"
        />

        {/* <DetailRow
          value={getVerboseAcceptationStatus(form?.wasteAcceptationStatus)}
          label="Lot accepté"
        /> */}
        {/* <DetailRow
          value={form?.quantityReceived && `${form?.quantityReceived} tonnes`}
          label="Quantité reçue"
        /> */}
        {/* <DetailRow value={form.wasteRefusalReason} label="Motif de refus" /> */}
      </div>
      <div className={styles.detailGrid}>
        <DetailRow
          value={operation?.processingOperation}
          label="Opération de traitement"
        />
        <DateRow
          value={operation?.processedAt}
          label="Traitement effectué le"
        />

        <DetailRow value={operation?.signedBy} label="Traitement signé par" />
        <DateRow value={operation?.signedAt} label="Traitement signé le" />
      </div>
    </>
  );
};

export default function SlipDetailContent({
  form,
  children = null,
  refetch,
}: SlipDetailContentProps) {
  const { siret } = useParams<{ siret: string }>();

  if (!form) {
    return <div></div>;
  }

  return (
    <div className={styles.detail}>
      <div className={styles.detailSummary}>
        <h4 className={styles.detailTitle}>
          <span className={styles.detailStatus}>
            [{statusLabels[form.status]}]
          </span>
          {form.status !== "DRAFT" && <span>{form.readableId}</span>}

          {!!form.customId && (
            <span className="tw-ml-auto">Numéro libre: {form.customId}</span>
          )}
        </h4>

        <div className={styles.detailContent}>
          <div className={`${styles.detailQRCodeIcon}`}>
            {form.status !== "DRAFT" && (
              <div className={styles.detailQRCode}>
                <QRCodeIcon value={form.readableId} size={96} />
                <span>Ce QR code contient le numéro du bordereau </span>
              </div>
            )}
          </div>
          <div className={styles.detailGrid}>
            <dt>Code déchet</dt>
            <dd>{form.emission?.wasteCode}</dd>
            <dt>Volume PRED</dt>
            <dd>{form.emission?.wasteDetails?.volume || "?"} litre</dd>
            {/* <PackagingRow packagingInfos={form.emission?.wasteDetails?.packagingInfos} /> */}
          </div>

          <div className={styles.detailGrid}>
            <dt>Code onu</dt>
            <dd>{form?.emission?.wasteDetails?.onuCode}</dd>
          </div>
        </div>
      </div>

      <Tabs selectedTabClassName={styles.detailTabSelected}>
        {/* Tabs menu */}
        <TabList className={styles.detailTabs}>
          <Tab className={styles.detailTab}>
            <WaterDamIcon color="#000" size={25} />
            <span className={styles.detailTabCaption}>Producteur</span>
          </Tab>

          <Tab className={styles.detailTab}>
            <WarehouseDeliveryIcon color="#000" size={25} />
            <span className={styles.detailTabCaption}>
              <span> Transporteur</span>
            </span>
          </Tab>

          <Tab className={styles.detailTab}>
            <RenewableEnergyEarthIcon color="#000" size={25} />
            <span className={styles.detailTabCaption}>Destinataire</span>
          </Tab>
        </TabList>
        {/* Tabs content */}
        <div className={styles.detailTabPanels}>
          {/* Emitter tab panel */}
          <TabPanel className={styles.detailTabPanel}>
            <div className={styles.detailColumns}>
              <div className={styles.detailGrid}>
                <Company label="Émetteur" company={form.emitter?.company} />

                <DetailRow
                  value={form.emitter?.workSite?.name}
                  label="Adresse d'enlèvement"
                />
                {!!form.emitter?.workSite?.address && (
                  <>
                    <dt>Adresse Chantier</dt>
                    <dd>
                      {form.emitter?.workSite?.address}{" "}
                      {form.emitter?.workSite?.postalCode}{" "}
                      {form.emitter?.workSite?.city}
                    </dd>
                  </>
                )}
              </div>
              <div className={styles.detailGrid}>
                <dt>Quantité</dt>{" "}
                <dd>{form.emission?.wasteDetails?.quantity} tonnes</dd>
                <DetailRow
                  value={getVerboseQuantityType(
                    form.emission?.wasteDetails?.quantityType
                  )}
                  label="Quantité"
                />
                <DateRow
                  value={form.emission?.handedOverAt}
                  label="Envoyé le"
                />
                <DetailRow value={form.emission?.signedAt} label="Signé par" />
                <DateRow value={form.emission?.signedAt} label="Signé le" />
              </div>
            </div>
          </TabPanel>
          {/* Trader tab panel */}

          {/* Transporter tab panel */}
          <TabPanel className={styles.detailTabPanel}>
            <div className={`${styles.detailGrid} `}>
              <Company
                label="Transporteur"
                company={form.transporter?.company}
              />
            </div>
            <div className={styles.detailGrid}>
              <DetailRow
                value={form?.transporter?.receipt}
                label="Numéro de récépissé"
              />
              <DetailRow
                value={form?.transporter?.receiptDepartment}
                label="Département"
              />
              <DateRow
                value={form?.transporter?.receiptValidityLimit}
                label="Date de validité"
              />

              {/* <YesNoRow
                value={form.signedByTransporter}
                label="Signé par le transporteur"
              /> */}
              {/* <DateRow value={form.sentAt} label="Date de prise en charge" /> */}
              <dt>Quantité</dt>{" "}
                <dd>{form.transport?.wasteDetails?.quantity} tonnes</dd>
                <DetailRow
                  value={getVerboseQuantityType(
                    form.transport?.wasteDetails?.quantityType
                  )}
                  label="Quantité"
                />
              <DetailRow value={form.transport?.signedAt} label="Signé par" />
              <DateRow value={form.transport?.signedAt} label="Signé le" />
            </div>
          </TabPanel>

          {/* Recipient  tab panel */}
          <TabPanel className={styles.detailTabPanel}>
            <div className={styles.detailColumns}>
              <Recipient form={form} />
            </div>
          </TabPanel>
        </div>
      </Tabs>
      <div className={styles.detailActions}>
        {/* <Duplicate formId={form.id} small={false} redirectToDashboard={true} /> */}
        {form.status === "DRAFT" ? (
          <>
            <p></p>
            {/* <Delete formId={form.id} small={false} redirectToDashboard={true} />
            <Edit formId={form.id} small={false} /> */}
          </>
        ) : (
          <p></p>
          // <DownloadPdf formId={form.id} small={false} />
        )}
        {/* {statusesWithDynamicActions.includes(form.status) && ( */}

        {/* <DynamicActions siret={siret} form={form} refetch={refetch} /> */}
        {/* )} */}
        {/* {children}
      </div> */}
      </div>
    </div>
  );
}
