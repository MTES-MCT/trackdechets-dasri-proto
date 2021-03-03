const initialCompany = {
  siret: "",
  name: "",
  address: "",
  contact: "",
  mail: "",
  phone: "",
};

export default {
  emitter: {
    company: {
      siret: "",
      name: "",
      address: "",
      contact: "",
      mail: "",
      phone: "",
    },
    workSite: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      infos: "",
    },
  },
  emission: {
    wasteCode: "",
  
    wasteDetails: {
      quantity: null,
      quantityType: null,
      packagingInfos: [],
      onuCode: "",
    },
  },
  transporter: {
    company: {
      siret: "",
      name: "",
      address: "",
      contact: "",
      mail: "",
      phone: "",
    },
    receipt: "",
    receiptDepartment: "",
    receiptValidityLimit: "",
  },
  transport: {
    wasteDetails: {
      quantity: null,
      quantityType: null,
      packagingInfos: [],
    },
    wasteAcceptation: {
      status : "",
      refusalReason : "",
      refusedQuantity: null
    }
  },
  recipient: {
    company: {
      siret: "",
      name: "",
      address: "",
      contact: "",
      mail: "",
      phone: "",
    },
  },
  reception: {
    wasteDetails: {
      quantity: null,
      quantityType: null,
      packagingInfos: [],
    },
    wasteAcceptation: {
      status : "",
      refusalReason : "",
      refusedQuantity: null
    }
  },
  operation: {
    processingOperation: "",
    processedAt: null
  }
};
