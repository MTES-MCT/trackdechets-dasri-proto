import prisma from "../../prisma";
import { BsdasriStatus, QuantityType, Prisma } from "@prisma/client";
import getReadableId, { ReadableIdPrefix } from "../../forms/readableId";

const dasriData = () => ({
  status: "INITIAL" as BsdasriStatus,
  id: getReadableId(ReadableIdPrefix.DASRI),
  isDeleted: false,
  emitterCompanyName: "hospital",
  emitterCompanySiret: "12345678974589",
  emitterCompanyAddress: "rue machin 75000 paris",
  emitterCompanyContact: "EL Doctor",
  emitterCompanyPhone: "0100000000",
  emitterCompanyMail: "doctor@hospital.td",

  wasteDetailsCode: "18 01 02*",
  wasteDetailsOnuCode: "wyz",
  emitterWasteVolume: 10,
  emitterWasteQuantity: 0,
  emitterWasteQuantityType: "REAL" as QuantityType,

  emitterWastePackagingsInfo: []
  // handedOverToTransporterAt: null,

  // transporterCompanyName: "",
  // transporterCompanySiret: "",
  // transporterCompanyAddress: "",
  // transporterCompanyPhone: "",
  // transporterCompanyContact: "",
  // transporterCompanyMail: "",
  // transporterReceipt: "",
  // transporterReceiptDepartment: "",
  // transporterReceiptValidityLimit: null,
  // transporterWasteAcceptationStatus: null,
  // transporterWasteRefusalReason: null,
  // transporterWasteRefusedQuantity: null,
  // transporterTakenOverAt: null,
  // transporterWastePackagingsInfo: [],
  // transporterWasteQuantity: 0,
  // transporterWasteQuantityType: null,
  // transporterWasteVolume: 0,
  // handedOverToRecipientAt: null,

  // recipientCompanyName: "",
  // recipientCompanySiret: "",
  // recipientCompanyAddress: "",
  // recipientCompanyContact: "",
  // recipientCompanyPhone: "",
  // recipientCompanyMail: "",
  // recipientWastePackagingsInfo: [],
  // recipientWasteAcceptationStatus: null,
  // recipientWasteRefusalReason: null,
  // recipientWasteRefusedQuantity: null,
  // recipientWasteQuantity: null,
  // recipientWasteVolume: 0,

  // processingOperation: null,
  // processedAt: null
});

export const bsdasriFactory = async ({
  ownerId,
  opt = {}
}: {
  ownerId: string;
  opt?: Partial<Prisma.BsdasriCreateInput>;
}) => {
  const dasriParams = { ...dasriData(), ...opt };
  return prisma.bsdasri.create({
    data: {
      ...dasriParams,
      owner: { connect: { id: ownerId } }
    }
  });
};
