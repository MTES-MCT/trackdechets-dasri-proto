import { useMutation } from "@apollo/client";
import React, { useState, useEffect, useCallback } from "react";
import { Form, Dasri } from "generated/graphql/types";

import {
  WaterDamIcon,
  CogApprovedIcon,
  PaperWriteIcon,
  WarehouseStorageIcon,
  ChevronDown,
  ChevronUp,
} from "common/components/Icons";

import "./BsdActions.scss";
import { isDasri, isForm } from "common/typeGuards";
import Edit from "./Edit";
// import Duplicate from "./Duplicate";
// import Quicklook from "./Quicklook";
import { getDasriNextStep } from "./next-step";
// import Processed from "./Processed";
// import Received from "./Received";
import Sealed from "./Sealed";
// import Resealed from "./Resealed";
  import mutations from "./bsd-actions.mutations";
import { NotificationError } from "common/components/Error";
import OutsideClickHandler from "react-outside-click-handler";
import { COLORS } from "common/config";
import TdModal from "common/components/Modal";
import ActionButton from "common/components/ActionButton";
import { bsdTypes } from "common/types";

export type BsdActionProps = {
  onSubmit: (vars: any) => any;
  onCancel: () => void;
  form: Form;
};
interface BsdActionsProps {
  bsdType: bsdTypes;
  bsdId: string;
  bsdStatus: string;
  siret: string;
}

export const BsdActions = ({
  bsdType,
  bsdId,
  bsdStatus,
  siret,
}: BsdActionsProps) => {
  const [dropdownOpened, toggleDropdown] = useState(false);
  // To avoid tracking each dropdown opening state we rely on OutsideClickHandler to close opened dropdown
  // when we open another one.
  // As contextual modals are dom-nested in triggering buttons, they would be
  // closed by <OutsideClickHandler> when we click anywhere on the screen
  // so we enable/disable the outside click behaviour
  const [outsideClickEnabled, toggleOutsideClick] = useState(true);
  const disableOutsideClick = () => toggleOutsideClick(false);

  // callback when a child modal is closed
  const _onClose = () => {
    toggleOutsideClick(true);
    toggleDropdown(false);
  };
  // Avoid warning and rerendering in granchild useEffect()
  const onClose = useCallback(() => _onClose(), []);
  return (
    <OutsideClickHandler
      useCapture={false}
      onOutsideClick={() => {
        if (dropdownOpened && outsideClickEnabled) {
          toggleDropdown(false);
        }
      }}
    >
      <div className="slips-actions">
        <button
          onClick={() => toggleDropdown(!dropdownOpened)}
          className="slips-actions-trigger"
        >
          <span>Actions</span>
          {dropdownOpened ? (
            <ChevronUp size={18} color={COLORS.blueLight} />
          ) : (
            <ChevronDown size={18} color={COLORS.blueLight} />
          )}
        </button>
        {dropdownOpened && (
          <div className="slips-actions__content">
            <ul className="slips-actions__items">
              <li className="slips-actions__item">
                {/* <Quicklook
                  formId={form.id}
                  buttonClass="btn--no-style slips-actions__button"
                  onOpen={disableOutsideClick}
                  onClose={onClose}
                /> */}
              </li>

              {bsdStatus === "DRAFT" ? (
                <>
                  <li className="slips-actions__item">
                    {/* <Delete
                      formId={form.id}
                      onOpen={disableOutsideClick}
                      onClose={onClose}
                    /> */}
                  </li>
                  <li className="slips-actions__item">
                    <Edit bsdId={bsdId} bsdType={bsdType} />
                  </li>
                </>
              ) : (
                <li className="slips-actions__item">
                  {/* <DownloadPdf formId={form.id} onSuccess={onClose} /> */}
                </li>
              )}
              <li className="slips-actions__item">
                {/* <Duplicate formId={form.id} onClose={onClose} /> */}
              </li>
            </ul>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

interface DynamicBsdActionsProps {
  bsd: Dasri | Form;
  siret: string;
  refetch?: () => void;
}

const retrieveNextStep = (bsd, siret) => {
  if (isDasri(bsd)) {
    return getDasriNextStep(bsd, siret);
  }
};

export function DynamicActions({
  bsd,
  siret,
  refetch,
}: DynamicBsdActionsProps) {
  const nextStep = retrieveNextStep(bsd, siret);
  // This dynamic mutation must have a value, otherwise the `useMutation` hook throws.
  // And hooks should not be conditionally called (cf rules of hooks)
  // Therefore, when there is no `nextStep`, we assign it **any** mutation: it does not matter as it will never get called
  // Indeed nothing is rendered when there is no `nextStep`
  const dynamicMutation = nextStep
    ? mutations.dasri[nextStep]
    : mutations.dasri.DELETE_FORM;

  const [isOpen, setIsOpen] = useState(false);
  const [mark, { error }] = useMutation(dynamicMutation, {
    onCompleted: () => {
      !!refetch && refetch();
    },
  });

  useEffect(() => {
    setIsOpen(false);
  }, [nextStep]);

  const ButtonComponent = nextStep ? buttons[nextStep].component : null;

  if (!nextStep) {
    return null;
  }

  return (
    <div className="SlipActions">
      <ActionButton
        title={buttons[nextStep].title}
        icon={buttons[nextStep].icon}
        onClick={() => setIsOpen(true)}
      />

      <TdModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel={buttons[nextStep].title}
      >
        <h2 className="td-modal-title">{buttons[nextStep].title}</h2>
        {ButtonComponent && (
          <ButtonComponent
            onCancel={() => setIsOpen(false)}
            onSubmit={vars => mark({ variables: { id: bsd.id, ...vars } })}
            form={bsd}
          />
        )}
        {error && (
          <NotificationError className="action-error" apolloError={error} />
        )}
      </TdModal>
    </div>
  );
}

const buttons = {
  SEALED: {
    title: "Finaliser le bordereau",
    icon: PaperWriteIcon,
    component: Sealed,
  },
  // RECEIVED: {
  //   title: "Valider la réception",
  //   icon: WaterDamIcon,
  //   component: Received,
  // },
  // PROCESSED: {
  //   title: "Valider le traitement",
  //   icon: CogApprovedIcon,
  //   component: Processed,
  // },
  // TEMP_STORED: {
  //   title: "Valider l'entreposage provisoire",
  //   icon: WarehouseStorageIcon,
  //   component: Received,
  // },
  // RESEALED: {
  //   title: "Compléter le BSD suite",
  //   icon: PaperWriteIcon,
  //   component: Resealed,
  // },
};
