import {
  Dasri as GqlDasri,
  DasriEmitter,
  DasriTransporter,
  DasriRecipient,
  DasriWasteDetails,
  FormCompany,
  DasriInput,
  DasriEmitterInput,
  DasriTransporterInput,
  DasriRecipientInput,
  DasriOperationInput,
  WorkSite,
  DasriEmission,
  DasriTransport,
  DasriReception,
  DasriOperation,
  DasriWasteAcceptation,
  DasriEmissionInput,
  DasriTransportInput,
  DasriReceptionInput,
  DasriPackagingInfo,
  DasriPackagingInfoInput
} from "../generated/graphql/types";
import { Prisma, Dasri, DasriStatus, QuantityType } from "@prisma/client";

/**
 * Return null if all object values are null
 * obj otherwise
 */
export function nullIfNoValues<T>(obj: T): T | null {
  return Object.values(obj).some(v => v !== null) ? obj : null;
}

export function expandDasriFromDb(dasri: Dasri): GqlDasri {
  return {
    id: dasri.id,
    readableId: dasri.readableId,
    customId: dasri.customId,

    emitter: nullIfNoValues<DasriEmitter>({
      company: nullIfNoValues<FormCompany>({
        name: dasri.emitterCompanyName,
        siret: dasri.emitterCompanySiret,
        address: dasri.emitterCompanyAddress,
        phone: dasri.emitterCompanyPhone,
        mail: dasri.emitterCompanyMail
      }),
      workSite: nullIfNoValues<WorkSite>({
        name: dasri.emitterWorkSiteName,
        address: dasri.emitterWorkSiteAddress,
        city: dasri.emitterWorkSiteCity,
        postalCode: dasri.emitterWorkSitePostalCode,
        infos: dasri.emitterWorkSiteInfos
      })
    }),
    emission: nullIfNoValues<DasriEmission>({
      wasteCode: dasri.wasteDetailsCode,
      wasteDetailsOnuCode: dasri.wasteDetailsOnuCode,
      handedOverAt: dasri.handedOverToTransporterAt?.toISOString(),
      signedBy: dasri.emissionSignedBy,
      signedAt: dasri.emissionSignedAt?.toISOString(),
      wasteDetails: nullIfNoValues<DasriWasteDetails>({
        quantity: dasri.emitterWasteQuantity,
        quantityType: dasri.emitterWasteQuantityType as QuantityType,
        volume: dasri.emitterWasteVolume,
        packagingInfos: dasri.emitterWastePackagingsInfo as DasriPackagingInfo[]
      })
    }),

    transporter: nullIfNoValues<DasriTransporter>({
      company: nullIfNoValues<FormCompany>({
        name: dasri.transporterCompanyName,
        siret: dasri.transporterCompanySiret,
        address: dasri.transporterCompanyAddress,
        phone: dasri.transporterCompanyPhone,
        mail: dasri.transporterCompanyMail
      }),

      receipt: dasri.transporterReceipt,
      receiptDepartment: dasri.transporterReceiptDepartment,
      receiptValidityLimit: dasri.transporterReceiptValidityLimit?.toISOString()
    }),
    transport: nullIfNoValues<DasriTransport>({
      wasteDetails: nullIfNoValues<DasriWasteDetails>({
        quantity: dasri.transporterWasteQuantity,
        quantityType: dasri.transporterWasteQuantityType as QuantityType,
        volume: dasri.transporterWasteVolume,
        packagingInfos: dasri.transporterWastePackagingsInfo as DasriPackagingInfo[]
      }),

      wasteAcceptation: nullIfNoValues<DasriWasteAcceptation>({
        status: dasri.transporterWasteAcceptationStatus,
        refusalReason: dasri.transporterWasteRefusalReason,
        refusedQuantity: dasri.transporterWasteRefusedQuantity
      }),
      takenOverAt: dasri.transporterTakenOverAt?.toISOString(),
      handedOverAt: dasri.handedOverToRecipientAt?.toISOString(),
      signedBy: dasri.transportSignedBy,
      signedAt: dasri.transportSignedAt?.toISOString()
    }),
    recipient: nullIfNoValues<DasriRecipient>({
      company: nullIfNoValues<FormCompany>({
        name: dasri.recipientCompanyName,
        siret: dasri.recipientCompanySiret,
        address: dasri.recipientCompanyAddress,
        phone: dasri.recipientCompanyPhone,
        mail: dasri.recipientCompanyMail
      })
    }),
    reception: nullIfNoValues<DasriReception>({
      wasteDetails: nullIfNoValues<DasriWasteDetails>({
        quantity: dasri.recipientWasteQuantity,
        volume: dasri.recipientWasteVolume,
        packagingInfos: dasri.recipientWastePackagingsInfo as DasriPackagingInfo[]
      }),
      wasteAcceptation: nullIfNoValues<DasriWasteAcceptation>({
        status: dasri.recipientWasteAcceptationStatus,
        refusalReason: dasri.recipientWasteRefusalReason,
        refusedQuantity: dasri.recipientWasteRefusedQuantity
      }),
      receivedAt: dasri.receivedAt?.toISOString(),
      signedBy: dasri.receptionSignedBy,
      signedAt: dasri.receptionSignedAt?.toISOString()
    }),
    operation: nullIfNoValues<DasriOperation>({
      processingOperation: dasri.processingOperation,
      processedAt: dasri.processedAt?.toISOString(),
      signedBy: dasri.operationSignedBy,
      signedAt: dasri.operationSignedAt?.toISOString()
    }),
    createdAt: dasri.createdAt?.toISOString(),
    updatedAt: dasri.updatedAt?.toISOString(),
    status: dasri.status as DasriStatus
  };
}

/**
 * Discard undefined fields in a flatten input
 * It is used to prevent overriding existing data when
 * updating records
 */
export function safeInput<K>(obj: K): Partial<K> {
  return Object.keys(obj).reduce((acc, curr) => {
    return {
      ...acc,
      ...(obj[curr] !== undefined ? { [curr]: obj[curr] } : {})
    };
  }, {});
}

type computeTotalVolumeFn = (
  packagingInfos: DasriPackagingInfoInput[]
) => number;
/**
 * Compute total volume according to packaging infos details
 */
const computeTotalVolume: computeTotalVolumeFn = packagingInfos => {
  if (!packagingInfos) {
    return null;
  }
  return packagingInfos.reduce(
    (acc, packaging) =>
      acc + (packaging.volume || 0) * (packaging.quantity || 0),
    0
  );
};
/**
 * Equivalent to a typescript optional chaining operator foo?.bar
 * except that it returns "null" instead of "undefined" if "null" is encountered in the chain
 * It allows to differentiate between voluntary null update and field omission that should
 * not update any data
 */
export function chain<T, K>(o: T, getter: (o: T) => K): K | null | undefined {
  if (o === null) {
    return null;
  }
  if (o === undefined) {
    return undefined;
  }
  return getter(o);
}

function flattenEmitterInput(input: { emitter?: DasriEmitterInput }) {
  return {
    emitterCompanyName: chain(input.emitter, e =>
      chain(e.company, c => c.name)
    ),
    emitterCompanySiret: chain(input.emitter, e =>
      chain(e.company, c => c.siret)
    ),
    emitterCompanyAddress: chain(input.emitter, e =>
      chain(e.company, c => c.address)
    ),
    emitterCompanyContact: chain(input.emitter, e =>
      chain(e.company, c => c.contact)
    ),
    emitterCompanyPhone: chain(input.emitter, e =>
      chain(e.company, c => c.phone)
    ),
    emitterCompanyMail: chain(input.emitter, e =>
      chain(e.company, c => c.mail)
    ),
    emitterWorkSiteName: chain(input.emitter, e =>
      chain(e.workSite, w => w.name)
    ),
    emitterWorkSiteAddress: chain(input.emitter, e =>
      chain(e.workSite, w => w.address)
    ),
    emitterWorkSiteCity: chain(input.emitter, e =>
      chain(e.workSite, w => w.city)
    ),
    emitterWorkSitePostalCode: chain(input.emitter, e =>
      chain(e.workSite, w => w.postalCode)
    ),
    emitterWorkSiteInfos: chain(input.emitter, e =>
      chain(e.workSite, w => w.infos)
    )
  };
}

function flattenEmissionInput(input: { emission?: DasriEmissionInput }) {
  if (!input?.emission) {
    return null;
  }
  const emitterWastePackagingsInfo = chain(input.emission, e =>
    chain(e.wasteDetails, w => w.packagingInfos)
  );
  return {
    wasteDetailsCode: chain(input.emission, e => e.wasteCode),
    wasteDetailsOnuCode: chain(input.emission, e => e.wasteDetailsOnuCode),
    handedOverToTransporterAt: chain(input.emission, e =>
      e.handedOverAt ? new Date(e.handedOverAt) : null
    ),
    emitterWasteQuantity: chain(input.emission, e =>
      chain(e.wasteDetails, w => w.quantity)
    ),
    emitterWasteQuantityType: chain(input.emission, e =>
      chain(e.wasteDetails, w => w.quantityType)
    ),
    emitterWasteVolume: computeTotalVolume(emitterWastePackagingsInfo),
    emitterWastePackagingsInfo
  };
}
function flattenTransporterInput(input: {
  transporter?: DasriTransporterInput;
}) {
  return {
    transporterCompanyName: chain(input.transporter, t =>
      chain(t.company, c => c.name)
    ),
    transporterCompanySiret: chain(input.transporter, t =>
      chain(t.company, c => c.siret)
    ),
    transporterCompanyAddress: chain(input.transporter, t =>
      chain(t.company, c => c.address)
    ),
    transporterCompanyContact: chain(input.transporter, t =>
      chain(t.company, c => c.contact)
    ),
    transporterCompanyPhone: chain(input.transporter, t =>
      chain(t.company, c => c.phone)
    ),
    transporterCompanyMail: chain(input.transporter, t =>
      chain(t.company, c => c.mail)
    ),

    transporterReceipt: chain(input.transporter, t => t.receipt),
    transporterReceiptDepartment: chain(
      input.transporter,
      t => t.receiptDepartment
    ),
    transporterReceiptValidityLimit: chain(input.transporter, t =>
      t.receiptValidityLimit ? new Date(t.receiptValidityLimit) : null
    )
  };
}
function flattenTransportInput(input: { transport?: DasriTransportInput }) {
  const transporterWastePackagingsInfo = chain(input.transport, t =>
    chain(t.wasteDetails, w => w.packagingInfos)
  );
  return {
    transporterTakenOverAt: chain(input.transport, t =>
      t.takenOverAt ? new Date(t.takenOverAt) : null
    ),
    handedOverToRecipientAt: chain(input.transport, t =>
      t.handedOverAt ? new Date(t.handedOverAt) : null
    ),
    transporterWasteQuantity: chain(input.transport, t =>
      chain(t.wasteDetails, w => w.quantity)
    ),
    transporterWasteQuantityType: chain(input.transport, t =>
      chain(t.wasteDetails, w => w.quantityType)
    ),
    transporterWasteAcceptationStatus: chain(input.transport, t =>
      chain(t.wasteAcceptation, w => w.status)
    ),
    transporterWasteRefusedQuantity: chain(input.transport, t =>
      chain(t.wasteAcceptation, w => w.refusedQuantity)
    ),
    transporterWasteRefusalReason: chain(input.transport, t =>
      chain(t.wasteAcceptation, w => w.refusalReason)
    ),
    transporterWasteVolume: computeTotalVolume(transporterWastePackagingsInfo),
    transporterWastePackagingsInfo
  };
}

function flattenRecipientInput(input: { recipient?: DasriRecipientInput }) {
  return {
    recipientCompanyName: chain(input.recipient, r =>
      chain(r.company, c => c.name)
    ),
    recipientCompanySiret: chain(input.recipient, r =>
      chain(r.company, c => c.siret)
    ),
    recipientCompanyAddress: chain(input.recipient, r =>
      chain(r.company, c => c.address)
    ),
    recipientCompanyContact: chain(input.recipient, r =>
      chain(r.company, c => c.contact)
    ),
    recipientCompanyPhone: chain(input.recipient, r =>
      chain(r.company, c => c.phone)
    ),
    recipientCompanyMail: chain(input.recipient, r =>
      chain(r.company, c => c.mail)
    )
  };
}

function flattenReceptiontInput(input: { reception?: DasriReceptionInput }) {
  const recipientWastePackagingsInfo = chain(input.reception, r =>
    chain(r.wasteDetails, w => w.packagingInfos)
  );
  return {
    recipientWasteQuantity: chain(input.reception, r =>
      chain(r.wasteDetails, w => w.quantity)
    ),
    recipientWasteVolume: computeTotalVolume(recipientWastePackagingsInfo),
    receivedAt: chain(input.reception, r =>
      r.receivedAt ? new Date(r.receivedAt) : null
    ),

    recipientWastePackagingsInfo
  };
}

function flattenOperationInput(input: { operation?: DasriOperationInput }) {
  return {
    processingOperation: chain(input.operation, r => r.processingOperation),
    processedAt: chain(input.operation, r =>
      r.processedAt ? new Date(r.processedAt) : null
    )
  };
}
export function flattenDasriInput(
  formInput: Pick<
    DasriInput,
    | "customId"
    | "emitter"
    | "emission"
    | "transporter"
    | "transport"
    | "recipient"
    | "reception"
    | "operation"
  >
): Partial<Prisma.DasriCreateInput> {
  return safeInput({
    customId: formInput.customId,
    ...flattenEmitterInput(formInput),
    ...flattenEmissionInput(formInput),
    ...flattenTransporterInput(formInput),
    ...flattenTransportInput(formInput),
    ...flattenRecipientInput(formInput),
    ...flattenReceptiontInput(formInput),
    ...flattenOperationInput(formInput)
  });
}
