const initialCompany = {
  siret: "",
  name: "",
  address: "",
  contact: "",
  mail: "",
  phone: "",
};

const initialTransporter = {
  isExemptedOfReceipt: false,
  receipt: "",
  department: "",
  validityLimit: null,

  company: initialCompany,
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
    wasteDetailsOnuCode: "",
    wasteDetails: {
      quantity: null,
      quantityType: null,
      packagingInfos: [],
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
  },
  transport: {
    wasteDetails: {
      quantity: 99,
      quantityType: "REAL",
      packagingInfos: [],
    },
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
  },
};
