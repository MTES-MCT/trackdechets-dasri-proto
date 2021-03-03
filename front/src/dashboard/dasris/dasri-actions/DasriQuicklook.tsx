import React, { useState } from "react";

import { ViewIcon } from "common/components/Icons";

import { useQuery } from "@apollo/client";
import SlipDetailContent from "dashboard/dasri/SlipDetailContent";

import { ModalLoader } from "common/components/Loaders";
import TdModal from "common/components/Modal";

import { Query, QueryBsdasriArgs } from "generated/graphql/types";
import { InlineError } from "common/components/Error";
import { DASRI_GET } from "dashboard/dasris/queries";

import { COLORS } from "common/config";
const DasriQuicklookModal = ({ formId, onClose }) => {
  const { loading, error, data } = useQuery<
    Pick<Query, "bsdasri">,
    QueryBsdasriArgs
  >(DASRI_GET, {
    variables: {
      id: formId,
      readableId: null,
    },
    skip: !formId,
    fetchPolicy: "network-only",
  });
  const bsdasri = data?.bsdasri;

  return (
    <TdModal
      onClose={onClose}
      ariaLabel="Aperçu du bordereau"
      isOpen={true}
      padding={false}
      wide={true}
    >
      {loading && <ModalLoader />}
      {error && <InlineError apolloError={error} />}

      {!!bsdasri && (
        <SlipDetailContent form={bsdasri}>
          <button className="btn btn--primary" onClick={onClose}>
            Fermer
          </button>
        </SlipDetailContent>
      )}
    </TdModal>
  );
};

type QuicklookProps = {
  formId: string;
  buttonClass: string;
  onOpen?: () => void;
  onClose?: () => void;
};

export default function Quicklook({
  formId,
  buttonClass,
  onOpen,
  onClose,
}: QuicklookProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className={buttonClass}
        title="Aperçu du bordereau"
        onClick={() => {
          setIsOpen(true);
          !!onOpen && onOpen();
        }}
      >
        <ViewIcon color={COLORS.blueLight} size={24} />
        <span>Aperçu</span>
      </button>
      {isOpen && (
        <DasriQuicklookModal
          formId={formId}
          onClose={() => {
            setIsOpen(false);
            !!onClose && onClose();
          }}
        />
      )}
    </>
  );
}
