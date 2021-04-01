import { useMutation } from "@apollo/client";
import React, { useState, useEffect, useCallback } from "react";
import { Bsdasri } from "generated/graphql/types";
import { PdfIcon } from "common/components/Icons";
import {
  WaterDamIcon,
  PaperWriteIcon,
  ChevronDown,
  ChevronUp,
} from "common/components/Icons";

import "./DasriActions.scss";

import DasriSignature from "./Signature";
// import Duplicate from "./Duplicate";
import DasriQuicklook from "dashboard/dasris/dasri-actions/DasriQuicklook";

import { getDasriNextStep } from "./next-step";
// import Processed from "./Processed";
// import Received from "./Received";
import Sealed from "./Sealed";
// import Resealed from "./Resealed";
import mutations from "./dasri-actions.mutations";
import { NotificationError } from "common/components/Error";
import OutsideClickHandler from "react-outside-click-handler";
import { COLORS } from "common/config";
import TdModal from "common/components/Modal";
import ActionButton from "common/components/ActionButton";
const { REACT_APP_API_ENDPOINT } = process.env;

export type BsdActionProps = {
  onSubmit: (vars: any) => any;
  onCancel: () => void;
  dasri: Bsdasri;
};
interface BsdActionsProps {
  bsdasriId: string;
  bsdStatus: string;
  siret: string;
}

export const BsdasriActions = ({
  bsdasriId,
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
                <DasriQuicklook
                  formId={bsdasriId}
                  buttonClass="btn--no-style slips-actions__button"
                  onOpen={disableOutsideClick}
                  onClose={onClose}
                />
              </li>

              {bsdStatus === "DRAFT" ? (
                <></>
              ) : (
                <>
                  <li className="slips-actions__item">
                    <a
                      className="btn--no-style slips-actions__button"
                      type="button"
                      href={`${REACT_APP_API_ENDPOINT}/dasripdf/${bsdasriId}`}
                      target="_blank"
                    >
                      <PdfIcon size={24} color={COLORS.blueLight} />
                      <span>Pdf</span>
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

interface DynamicDasriActionsProps {
  dasri: Bsdasri;
  siret: string;
  refetch?: () => void;
}

export function DasriDynamicActions({
  dasri,
  siret,
  refetch,
}: DynamicDasriActionsProps) {
  const nextStep = getDasriNextStep(dasri, siret);

  // This dynamic mutation must have a value, otherwise the `useMutation` hook throws.
  // And hooks should not be conditionally called (cf rules of hooks)
  // Therefore, when there is no `nextStep`, we assign it **any** mutation: it does not matter as it will never get called
  // Indeed nothing is rendered when there is no `nextStep`
  const dynamicMutation = nextStep
    ? mutations.dasri.SEALED
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
            onSubmit={vars => mark({ variables: { id: dasri.id, ...vars } })}
            dasri={dasri}
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
  SIGNED_BY_PRODUCER: {
    title: "Signature producteur",
    icon: PaperWriteIcon,
    component: DasriSignature,
  },
  RECEIVED: {
    title: "Signature réception",
    icon: WaterDamIcon,
    component: Sealed,
  },
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
