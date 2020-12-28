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
  WorkSite,
  DasriEmission,
  DasriTransport,
  DasriReception,
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

export function expandDasriFromDb(form: Dasri): GqlDasri {
  return {
    id: form.id,
    readableId: form.readableId,
    customId: form.customId,

    emitter: nullIfNoValues<DasriEmitter>({
      company: nullIfNoValues<FormCompany>({
        name: form.emitterCompanyName,
        siret: form.emitterCompanySiret,
        address: form.emitterCompanyAddress,
        phone: form.emitterCompanyPhone,
        mail: form.emitterCompanyMail
      }),
      workSite: nullIfNoValues<WorkSite>({
        name: form.emitterWorkSiteName,
        address: form.emitterWorkSiteAddress,
        city: form.emitterWorkSiteCity,
        postalCode: form.emitterWorkSitePostalCode,
        infos: form.emitterWorkSiteInfos
      })
    }),
    emission: nullIfNoValues<DasriEmission>({
      wasteCode: form.wasteDetailsCode,
      wasteDetailsOnuCode: form.wasteDetailsOnuCode,
      handedOverAt: form.handedOverToTransporterAt?.toISOString(),
      signedBy: form.emitterSignedBy,
      signedAt: form.emitterSignedAt?.toISOString(),
      wasteDetails: nullIfNoValues<DasriWasteDetails>({
        quantity: form.emitterWasteQuantity,
        quantityType: form.emitterWasteQuantityType as QuantityType,
        volume: form.emitterWasteVolume,
        packagingInfos: form.emitterWastePackagingsInfo as DasriPackagingInfo[]
      })
    }),

    transporter: nullIfNoValues<DasriTransporter>({
      company: nullIfNoValues<FormCompany>({
        name: form.transporterCompanyName,
        siret: form.transporterCompanySiret,
        address: form.transporterCompanyAddress,
        phone: form.transporterCompanyPhone,
        mail: form.transporterCompanyMail
      }),

      receipt: form.transporterReceipt,
      department: form.transporterDepartment
    }),
    transport: nullIfNoValues<DasriTransport>({
      wasteDetails: nullIfNoValues<DasriWasteDetails>({
        quantity: form.transporterWasteQuantity,
        quantityType: form.transporterWasteQuantityType as QuantityType,
        volume: form.transporterWasteVolume,
        packagingInfos: form.transporterWastePackagingsInfo as DasriPackagingInfo[]
      }),

      wasteAcceptation: nullIfNoValues<DasriWasteAcceptation>({
        status: form.transporterWasteAcceptationStatus,
        refusalReason: form.transporterWasteRefusalReason

        // refusedQuantity: form.recipientWasteRefusedQuantity
      }),
      takenOverAt: form.transporterTakenOverAt?.toISOString(),
      handedOverAt: form.handedOverToRecipientAt?.toISOString(),
      signedBy: form.transporterSignedBy,
      signedAt: form.transporterSignedAt?.toISOString()
    }),
    recipient: nullIfNoValues<DasriRecipient>({
      company: nullIfNoValues<FormCompany>({
        name: form.recipientCompanyName,
        siret: form.recipientCompanySiret,
        address: form.recipientCompanyAddress,
        phone: form.recipientCompanyPhone,
        mail: form.recipientCompanyMail
      })
    }),
    reception: nullIfNoValues<DasriReception>({
      wasteDetails: nullIfNoValues<DasriWasteDetails>({
        quantity: form.recipientWasteQuantity,
        volume: form.recipientWasteVolume,
        packagingInfos: form.recipientWastePackagingsInfo as DasriPackagingInfo[]
      }),
      wasteAcceptation: nullIfNoValues<DasriWasteAcceptation>({
        status: form.recipientWasteAcceptationStatus,
        refusalReason: form.recipientWasteRefusalReason,

        refusedQuantity: form.recipientWasteRefusedQuantity
      }),
      receivedAt: form.receivedAt?.toISOString(),
      processingOperation: form.processingOperation,
      processedAt: form.processedAt?.toISOString()
    }),

    createdAt: form.createdAt?.toISOString(),
    updatedAt: form.updatedAt?.toISOString(),
    status: form.status as DasriStatus
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
    transporterDepartment: chain(input.transporter, t => t.department),
    transporterValidityLimit: chain(input.transporter, t =>
      t.validityLimit ? new Date(t.validityLimit) : null
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
    processingOperation: chain(input.reception, r => r.processingOperation),
    receivedAt: chain(input.reception, r =>
      r.receivedAt ? new Date(r.receivedAt) : null
    ),
    processedAt: chain(input.reception, r =>
      r.processedAt ? new Date(r.processedAt) : null
    ),
    recipientWastePackagingsInfo
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
  >
): Partial<Prisma.DasriCreateInput> {
  return safeInput({
    customId: formInput.customId,
    ...flattenEmitterInput(formInput),
    ...flattenEmissionInput(formInput),
    ...flattenTransporterInput(formInput),
    ...flattenTransportInput(formInput),
    ...flattenRecipientInput(formInput),
    ...flattenReceptiontInput(formInput)
  });
}
