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
      volume: null,
      packagingInfos: [],
    },
  },
  transporter: {
    company: {
      siret: "",
      name: "",
      address: "",
      // contact:"",
      mail: "",
      phone: "",
    },
  },
  transport: {
    wasteDetails: {
      quantity: 99,
      quantityType: "REAL",
      volume: 11,
      packagingInfos: [],
    },
  },
  recipient: {
    company: {
      siret: "",
      name: "",
      address: "",
      // contact:"",
      mail: "",
      phone: "",
    },
  },
  reception: {
    wasteDetails: {
      volume: null,
      quantity: null,
      quantityType: null,
      packagingInfos: [],
    },
  },
};
