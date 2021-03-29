import { FormsRegisterExportType } from "../../generated/graphql/types";

/**
 * Returns Form fragment for each export
 */
export function formFieldsSelection(exportType: FormsRegisterExportType) {
  return {
    OUTGOING: outgoingWasteFragment,
    INCOMING: incomingWasteFragment,
    TRANSPORTED: transportedWasteFragment,
    TRADED: tradedWasteFragment,
    BROKERED: brokeredWasteFragment,
    ALL: allWasteFragment
  }[exportType];
}

const outgoingWasteFragment = {
  readableId: true,
  customId: true,
  emitterWorkSiteName: true,
  emitterWorkSiteAddress: true,
  ecoOrganismeName: true,
  recipientCompanySiret: true,
  recipientCompanyName: true,
  recipientCompanyAddress: true,
  recipientCompanyMail: true,
  recipientCompanyPhone: true,
  recipientCompanyContact: true,
  recipientProcessingOperation: true,
  recipientIsTempStorage: true,
  temporaryStorageDetail: {
    select: {
      destinationCompanySiret: true,
      destinationCompanyName: true,
      destinationCompanyAddress: true,
      destinationCompanyMail: true,
      destinationCompanyPhone: true,
      destinationCompanyContact: true,
      destinationProcessingOperation: true,
      transporterCompanySiret: true,
      transporterCompanyName: true,
      transporterCompanyAddress: true,
      transporterIsExemptedOfReceipt: true,
      transporterReceipt: true,
      transporterValidityLimit: true,
      transporterNumberPlate: true
    }
  },
  quantityReceived: true,
  processingOperationDone: true,
  wasteDetailsCode: true,
  wasteDetailsQuantity: true,
  wasteDetailsPop: true,
  traderCompanyName: true,
  traderCompanySiret: true,
  traderReceipt: true,
  traderValidityLimit: true,
  traderCompanyContact: true,
  traderCompanyAddress: true,

  transporterCompanySiret: true,
  transporterCompanyName: true,
  transporterCompanyAddress: true,
  transporterIsExemptedOfReceipt: true,
  transporterReceipt: true,
  transporterValidityLimit: true,
  transporterNumberPlate: true,
  sentAt: true,
  nextDestinationProcessingOperation: true,
  nextDestinationCompanyName: true,
  nextDestinationCompanyContact: true,
  nextDestinationCompanyMail: true,
  nextDestinationCompanyPhone: true,
  nextDestinationCompanyAddress: true,
  nextDestinationCompanyCountry: true
};

const incomingWasteFragment = {
  readableId: true,
  customId: true,
  emitterCompanySiret: true,
  emitterCompanyName: true,
  emitterCompanyContact: true,
  emitterCompanyAddress: true,
  emitterWorkSiteName: true,
  emitterWorkSiteAddress: true,
  ecoOrganismeName: true,
  recipientProcessingOperation: true,
  recipientIsTempStorage: true,
  quantityReceived: true,
  wasteDetailsCode: true,
  wasteDetailsPop: true,
  traderCompanyName: true,
  traderCompanySiret: true,
  traderReceipt: true,
  traderValidityLimit: true,
  traderCompanyContact: true,
  traderCompanyAddress: true,

  transporterCompanySiret: true,
  transporterCompanyName: true,
  transporterCompanyAddress: true,
  transporterIsExemptedOfReceipt: true,
  transporterReceipt: true,
  transporterValidityLimit: true,
  transporterNumberPlate: true,
  processingOperationDone: true,
  receivedAt: true,
  isAccepted: true,
  nextDestinationProcessingOperation: true,
  nextDestinationCompanyName: true,
  nextDestinationCompanyContact: true,
  nextDestinationCompanyMail: true,
  nextDestinationCompanyPhone: true,
  nextDestinationCompanyAddress: true,
  nextDestinationCompanyCountry: true
};

const transportedWasteFragment = {
  readableId: true,
  customId: true,
  emitterCompanySiret: true,
  emitterCompanyName: true,
  emitterCompanyContact: true,
  emitterCompanyAddress: true,
  emitterWorkSiteName: true,
  emitterWorkSiteAddress: true,
  ecoOrganismeName: true,
  recipientCompanySiret: true,
  recipientCompanyName: true,
  recipientCompanyAddress: true,
  recipientCompanyMail: true,
  recipientCompanyPhone: true,
  recipientCompanyContact: true,
  recipientProcessingOperation: true,
  recipientIsTempStorage: true,
  quantityReceived: true,
  temporaryStorageDetail: {
    select: {
      destinationCompanySiret: true,
      destinationCompanyName: true,
      destinationCompanyAddress: true,
      destinationCompanyMail: true,
      destinationCompanyPhone: true,
      destinationCompanyContact: true,
      destinationProcessingOperation: true,
      transporterCompanySiret: true,
      transporterCompanyName: true,
      transporterCompanyAddress: true,
      transporterIsExemptedOfReceipt: true,
      transporterReceipt: true,
      transporterValidityLimit: true,
      transporterNumberPlate: true
    }
  },
  traderCompanyName: true,
  traderCompanySiret: true,
  traderReceipt: true,
  traderValidityLimit: true,
  traderCompanyContact: true,
  traderCompanyAddress: true,

  wasteDetailsCode: true,
  wasteDetailsPop: true,
  transporterNumberPlate: true,
  sentAt: true,
  receivedAt: true,
  isAccepted: true,
  nextDestinationProcessingOperation: true,
  nextDestinationCompanyName: true,
  nextDestinationCompanyContact: true,
  nextDestinationCompanyMail: true,
  nextDestinationCompanyPhone: true,
  nextDestinationCompanyAddress: true,
  nextDestinationCompanyCountry: true
};
const tradedWasteFragment = {
  readableId: true,
  customId: true,
  emitterCompanySiret: true,
  emitterCompanyName: true,
  emitterCompanyContact: true,
  emitterCompanyAddress: true,
  emitterWorkSiteName: true,
  emitterWorkSiteAddress: true,
  ecoOrganismeName: true,
  recipientCompanySiret: true,
  recipientCompanyName: true,
  recipientCompanyAddress: true,
  recipientCompanyMail: true,
  recipientCompanyPhone: true,
  recipientCompanyContact: true,
  recipientProcessingOperation: true,
  recipientIsTempStorage: true,
  quantityReceived: true,
  temporaryStorageDetail: {
    select: {
      destinationCompanySiret: true,
      destinationCompanyName: true,
      destinationCompanyAddress: true,
      destinationCompanyMail: true,
      destinationCompanyPhone: true,
      destinationCompanyContact: true,
      destinationProcessingOperation: true,
      transporterCompanySiret: true,
      transporterCompanyName: true,
      transporterCompanyAddress: true,
      transporterIsExemptedOfReceipt: true,
      transporterReceipt: true,
      transporterValidityLimit: true,
      transporterNumberPlate: true
    }
  },
  wasteDetailsCode: true,
  wasteDetailsQuantity: true,
  wasteDetailsPop: true,
  traderCompanyName: true,
  traderCompanySiret: true,
  traderReceipt: true,
  traderValidityLimit: true,
  traderCompanyContact: true,
  traderCompanyAddress: true,

  brokerValidityLimit: true,
  brokerCompanyContact: true,
  brokerCompanyAddress: true,
  transporterCompanySiret: true,
  transporterCompanyName: true,
  transporterCompanyAddress: true,
  transporterIsExemptedOfReceipt: true,
  transporterReceipt: true,
  transporterValidityLimit: true,
  transporterNumberPlate: true,
  sentAt: true,
  receivedAt: true,
  isAccepted: true,
  processingOperationDone: true,
  noTraceability: true,
  nextDestinationProcessingOperation: true,
  nextDestinationCompanyName: true,
  nextDestinationCompanyContact: true,
  nextDestinationCompanyMail: true,
  nextDestinationCompanyPhone: true,
  nextDestinationCompanyAddress: true,
  nextDestinationCompanyCountry: true
};

const brokeredWasteFragment = tradedWasteFragment;

const allWasteFragment = {
  readableId: true,
  customId: true,
  emitterCompanySiret: true,
  emitterCompanyName: true,
  emitterCompanyContact: true,
  emitterCompanyAddress: true,
  emitterWorkSiteName: true,
  emitterWorkSiteAddress: true,
  ecoOrganismeName: true,
  recipientCompanySiret: true,
  recipientCompanyName: true,
  recipientCompanyAddress: true,
  recipientCompanyMail: true,
  recipientCompanyPhone: true,
  recipientCompanyContact: true,
  recipientProcessingOperation: true,
  recipientIsTempStorage: true,
  quantityReceived: true,
  temporaryStorageDetail: {
    select: {
      destinationCompanySiret: true,
      destinationCompanyName: true,
      destinationCompanyAddress: true,
      destinationCompanyMail: true,
      destinationCompanyPhone: true,
      destinationCompanyContact: true,
      destinationProcessingOperation: true,
      transporterCompanySiret: true,
      transporterCompanyName: true,
      transporterCompanyAddress: true,
      transporterIsExemptedOfReceipt: true,
      transporterReceipt: true,
      transporterValidityLimit: true,
      transporterNumberPlate: true
    }
  },
  wasteDetailsCode: true,
  wasteDetailsQuantity: true,
  wasteDetailsPop: true,
  traderCompanyName: true,
  traderCompanySiret: true,
  traderReceipt: true,
  traderValidityLimit: true,
  traderCompanyContact: true,
  traderCompanyAddress: true,

  brokerValidityLimit: true,
  brokerCompanyContact: true,
  brokerCompanyAddress: true,
  transporterCompanySiret: true,
  transporterCompanyName: true,
  transporterCompanyAddress: true,
  transporterIsExemptedOfReceipt: true,
  transporterReceipt: true,
  transporterValidityLimit: true,
  transporterNumberPlate: true,
  sentAt: true,
  receivedAt: true,
  isAccepted: true,
  processingOperationDone: true,
  noTraceability: true,
  nextDestinationProcessingOperation: true,
  nextDestinationCompanyName: true,
  nextDestinationCompanyContact: true,
  nextDestinationCompanyMail: true,
  nextDestinationCompanyPhone: true,
  nextDestinationCompanyAddress: true,
  nextDestinationCompanyCountry: true
};
