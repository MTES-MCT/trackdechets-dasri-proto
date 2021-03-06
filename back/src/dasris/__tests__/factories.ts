import prisma from "../../prisma";
import { BsdasriStatus, QuantityType, Prisma } from "@prisma/client";

export function getDasriReadableId() {
  const year = new Date().getFullYear().toString().slice(-2);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const uid = Array.from({ length: 8 })
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");

  return `DASRI-${year}-${uid}`;
}

const dasriData = {
  status: "DRAFT" as BsdasriStatus,

  isDeleted: false,
  emitterCompanyName: "hospital",
  emitterCompanySiret: "12345678974589",
  emitterCompanyAddress: "rue machin 75000 paris",
  emitterCompanyContact: "EL Doctor",
  emitterCompanyPhone: "0100000000",
  emitterCompanyMail: "doctor@hospital.td",
  emitterWorkSiteName: "",
  emitterWorkSiteAddress: "",
  emitterWorkSiteCity: "",
  emitterWorkSitePostalCode: "",
  emitterWorkSiteInfos: "",
  wasteDetailsCode: "18 01 02*",
  wasteDetailsOnuCode: "",
  emitterWasteQuantity: 0,
  emitterWasteQuantityType: "REAL" as QuantityType,

  emitterWastePackagingsInfo: [],
  handedOverToTransporterAt: null,

  transporterCompanyName: "",
  transporterCompanySiret: "",
  transporterCompanyAddress: "",
  transporterCompanyPhone: "",
  transporterCompanyContact: "",
  transporterCompanyMail: "",
  transporterReceipt: "",
  transporterReceiptDepartment: "",
  transporterReceiptValidityLimit: null,
  transporterWasteAcceptationStatus: null,
  transporterWasteRefusalReason: null,
  transporterWasteRefusedQuantity: null,
  transporterTakenOverAt: null,
  transporterWastePackagingsInfo: [],
  transporterWasteQuantity: 0,
  transporterWasteQuantityType: null,
  transporterWasteVolume: 0,
  handedOverToRecipientAt: null,

  recipientCompanyName: "",
  recipientCompanySiret: "",
  recipientCompanyAddress: "",
  recipientCompanyContact: "",
  recipientCompanyPhone: "",
  recipientCompanyMail: "",
  recipientWastePackagingsInfo: [],
  recipientWasteAcceptationStatus: null,
  recipientWasteRefusalReason: null,
  recipientWasteRefusedQuantity: null,
  recipientWasteQuantity: null,
  recipientWasteVolume: 0,

  processingOperation: null,
  processedAt: null
};

export const dasriFactory = async ({
  ownerId,
  opt = {}
}: {
  ownerId: string;
  opt?: Partial<Prisma.BsdasriCreateInput>;
}) => {
  const dasriParams = { ...dasriData, ...opt };
  return prisma.bsdasri.create({
    data: {
      readableId: getDasriReadableId(),
      ...dasriParams,
      owner: { connect: { id: ownerId } }
    }
  });
};
