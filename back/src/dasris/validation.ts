import { EmitterType, Dasri, QuantityType } from "@prisma/client";
import { UserInputError } from "apollo-server-express";
import prisma from "src/prisma";

import * as yup from "yup";
import { DASRI_WASTE_CODES } from "../common/constants";
import configureYup from "../common/yup/configureYup";
import validDatetime from "../common/yup/validDatetime";
import { PackagingInfo, Packagings } from "../generated/graphql/types";

const wasteCodes = DASRI_WASTE_CODES.map(el => el.code);
// set yup default error messages
configureYup();

// ************************************************
// BREAK DOWN FORM TYPE INTO INDIVIDUAL FRAME TYPES
// ************************************************

type Emitter = Pick<
  Dasri,
  //   | "emitterType"
  | "emitterWorkSiteName"
  | "emitterWorkSiteAddress"
  | "emitterWorkSiteCity"
  | "emitterWorkSitePostalCode"
  | "emitterWorkSiteInfos"
  | "emitterCompanyName"
  | "emitterCompanySiret"
  | "emitterCompanyAddress"
  | "emitterCompanyContact"
  | "emitterCompanyPhone"
  | "emitterCompanyMail"
>;
type Emission = Pick<
  Dasri,
  | "wasteDetailsCode"
  | "wasteDetailsOnuCode"
  | "emitterWasteQuantity"
  | "emitterWasteQuantityType"
  | "emitterWasteVolume"
  | "emitterWastePackagingsInfo"
  | "handedOverToTransporterAt"
  | "emitterSignedBy"
  | "emitterSignedAt"
>;

type Transporter = Pick<
  Dasri,
  | "transporterCompanyName"
  | "transporterCompanySiret"
  | "transporterCompanyAddress"
  | "transporterCompanyContact"
  | "transporterCompanyPhone"
  | "transporterCompanyMail"
  | "transporterReceipt"
  | "transporterDepartment"
  | "transporterValidityLimit"
>;
type Transport = Pick<
  Dasri,
  | "transporterWasteAcceptationStatus"
  | "transporterWasteRefusalReason"
  | "transporterWasteRefusedQuantity"
  | "transporterTakenOverAt"
  | "transporterWastePackagingsInfo"
  | "transporterWasteQuantity"
  | "transporterWasteQuantityType"
  | "transporterWasteVolume"
  | "handedOverToRecipientAt"
  | "transporterSignedBy"
  | "transporterSignedAt"
>;
type Recipient = Pick<
  Dasri,
  | "recipientCompanyName"
  | "recipientCompanySiret"
  | "recipientCompanyAddress"
  | "recipientCompanyContact"
  | "recipientCompanyPhone"
  | "recipientCompanyMail"
>;
type Reception = Pick<
  Dasri,
  | "recipientWastePackagingsInfo"
  | "recipientWasteAcceptationStatus"
  | "recipientWasteRefusalReason"
  | "recipientWasteRefusedQuantity"
  | "recipientWasteQuantity"
  | "recipientWasteVolume"
  | "receivedAt"
  | "processingOperation"
  | "recipientSignedBy"
  | "recipientSignedAt"
>;

// *********************
// COMMON ERROR MESSAGES
// *********************

const MISSING_COMPANY_NAME = "Le nom de l'entreprise est obligatoire";
const MISSING_COMPANY_SIRET = "Le siret de l'entreprise est obligatoire";
const MISSING_COMPANY_ADDRESS = "L'adresse de l'entreprise est obligatoire";
const MISSING_COMPANY_CONTACT = "Le contact dans l'entreprise est obligatoire";
const MISSING_COMPANY_PHONE = "Le téléphone de l'entreprise est obligatoire";
const MISSING_COMPANY_EMAIL = "L'email de l'entreprise est obligatoire";

const INVALID_SIRET_LENGTH = "Le SIRET doit faire 14 caractères numériques";

const INVALID_PROCESSING_OPERATION =
  "Cette opération d’élimination / valorisation n'existe pas.";

const INVALID_WASTE_CODE =
  "Le code déchet n'est pas reconnu comme faisant partie de la liste officielle du code de l'environnement.";

const EXTRANEOUS_NEXT_DESTINATION = `L'opération de traitement renseignée ne permet pas de destination ultérieure`;

// export const emitterSchema: yup.ObjectSchema<
//   Partial<Emitter>
// > = yup.object().shape({
//   emitterCompanyName: yup
//     .string()
//     .ensure()
//     .required(`Émetteur: ${MISSING_COMPANY_NAME}`),
//   emitterCompanySiret: yup
//     .string()
//     .ensure()
//     .required(`Émetteur: ${MISSING_COMPANY_SIRET}`)
//     .length(14, `Émetteur: ${INVALID_SIRET_LENGTH}`),
//   emitterCompanyAddress: yup
//     .string()
//     .ensure()
//     .required(`Émetteur: ${MISSING_COMPANY_ADDRESS}`),
//   emitterCompanyContact: yup
//     .string()
//     .ensure()
//     .required(`Émetteur: ${MISSING_COMPANY_CONTACT}`),
//   emitterCompanyPhone: yup
//     .string()
//     .ensure()
//     .required(`Émetteur: ${MISSING_COMPANY_PHONE}`),
//   emitterCompanyMail: yup
//     .string()
//     .email()
//     .ensure()
//     .required(`Émetteur: ${MISSING_COMPANY_EMAIL}`)
// });

// export const recipientSchema: yup.ObjectSchema<
//   Partial<Recipient>
// > = yup.object().shape({
//   recipientProcessingOperation: yup
//     .string()
//     .label("Opération d’élimination / valorisation")
//     .ensure()
//     .required(),
//   recipientCompanyName: yup
//     .string()
//     .ensure()
//     .required(`Destinataire: ${MISSING_COMPANY_NAME}`),
//   recipientCompanySiret: yup
//     .string()
//     .ensure()
//     .required(`Destinataire: ${MISSING_COMPANY_SIRET}`)
//     .length(14, `Destinataire: ${INVALID_SIRET_LENGTH}`),
//   recipientCompanyAddress: yup
//     .string()
//     .ensure()
//     .required(`Destinataire: ${MISSING_COMPANY_ADDRESS}`),
//   recipientCompanyContact: yup
//     .string()
//     .ensure()
//     .required(`Destinataire: ${MISSING_COMPANY_CONTACT}`),
//   recipientCompanyPhone: yup
//     .string()
//     .ensure()
//     .required(`Destinataire: ${MISSING_COMPANY_PHONE}`),
//   recipientCompanyMail: yup
//     .string()
//     .email()
//     .ensure()
//     .required(`Destinataire: ${MISSING_COMPANY_EMAIL}`)
// });

// const packagingInfo: yup.ObjectSchema<PackagingInfo> = yup.object().shape({
//   type: yup
//     .mixed<Packagings>()
//     .required("Le type de conditionnement doit être précisé."),
//   other: yup
//     .string()
//     .when("type", (type, schema) =>
//       type === "AUTRE"
//         ? schema.required(
//             "La description doit être précisée pour le conditionnement 'AUTRE'."
//           )
//         : schema
//             .nullable()
//             .max(
//               0,
//               "${path} ne peut être renseigné que lorsque le type de conditionnement est 'AUTRE'."
//             )
//     ),
//   quantity: yup
//     .number()
//     .required(
//       "Le nombre de colis associé au conditionnement doit être précisé."
//     )
//     .integer()
//     .min(1, "Le nombre de colis doit être supérieur à 0."),
//   volume: yup
//     .number()
//     .required(
//       "Le volume en litres associé à chaque type de contenant doit être précisé."
//     )
//     .integer()
//     .min(1, "Le volume de chaque type de contenant doit être supérieur à 0.")
// });

 
// export const wasteDetailsSchema: yup.ObjectSchema<
//   Partial<WasteDetails>
// > = yup.object().shape({
//   wasteDetailsCode: yup
//     .string()
//     .ensure()
//     .required("Le code déchet est obligatoire")
//     .oneOf(wasteCodes, INVALID_WASTE_CODE),
//   wasteDetailsOnuCode: yup
//     .string()
//     .ensure()
//     .required(`La mention ADR est obligatoire.`),

//   wasteDetailsPackagingInfos: yup
//     .array()
//     .required("Le détail du conditionnement est obligatoire")
//     .of(packagingInfo)
//     .test(
//       "is-valid-packaging-infos",
//       "${path} ne peut pas à la fois contenir 1 citerne ou 1 benne et un autre conditionnement.",
//       (infos: PackagingInfo[]) => {
//         const hasCiterne = infos?.find(i => i.type === "CITERNE");
//         const hasBenne = infos?.find(i => i.type === "BENNE");

//         if (hasCiterne && hasBenne) {
//           return false;
//         }

//         const hasOtherPackaging = infos?.find(
//           i => !["CITERNE", "BENNE"].includes(i.type)
//         );
//         if ((hasCiterne || hasBenne) && hasOtherPackaging) {
//           return false;
//         }

//         return true;
//       }
//     ),
//   wasteDetailsQuantity: yup
//     .number()
//     .required("La quantité du déchet en tonnes est obligatoire")
//     .min(0, "La quantité doit être supérieure à 0"),
//   wasteDetailsQuantityType: yup
//     .mixed<QuantityType>()
//     .required("Le type de quantité (réelle ou estimée) doit être précisé"),
 
// });

 
// export const transporterSchema: yup.ObjectSchema<
//   Partial<Transporter>
// > = yup.object().shape({
//   transporterCompanyName: yup
//     .string()
//     .ensure()
//     .required(`Transporteur: ${MISSING_COMPANY_NAME}`),
//   transporterCompanySiret: yup
//     .string()
//     .ensure()
//     .required(`Transporteur: ${MISSING_COMPANY_SIRET}`)
//     .length(14, `Transporteur: ${INVALID_SIRET_LENGTH}`),
//   transporterCompanyAddress: yup
//     .string()
//     .ensure()
//     .required(`Transporteur: ${MISSING_COMPANY_ADDRESS}`),
//   transporterCompanyContact: yup
//     .string()
//     .ensure()
//     .required(`Transporteur: ${MISSING_COMPANY_CONTACT}`),
//   transporterCompanyPhone: yup
//     .string()
//     .ensure()
//     .required(`Transporteur: ${MISSING_COMPANY_PHONE}`),
//   transporterCompanyMail: yup
//     .string()
//     .email()
//     .ensure()
//     .required(`Transporteur: ${MISSING_COMPANY_EMAIL}`),
//   transporterIsExemptedOfReceipt: yup.boolean().notRequired().nullable(),
//   transporterReceipt: yup.string().ensure().required(),

//   transporterDepartment: yup
//     .string()
//     .ensure()
//     .required("Le département du transporteur est obligatoire"),

//   transporterValidityLimit: validDatetime({
//     verboseFieldName: "date de validité"
//   })
// });

export const draftDasriSchema = yup.object().shape({
  emitterCompanySiret: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^$|^\d{14}$/, {
      message: `Émetteur: ${INVALID_SIRET_LENGTH}`
    }),
  emitterCompanyMail: yup.string().email().nullable().notRequired(),
  recipientCompanySiret: yup
    .string()
    .notRequired()
    .nullable()
    .matches(/^$|^\d{14}$/, {
      message: `Destinataire: ${INVALID_SIRET_LENGTH}`
    }),
  recipientCompanyMail: yup.string().notRequired().nullable().email(),
  wasteDetailsCode: yup
    .string()
    .notRequired()
    .nullable()
    .oneOf([...wasteCodes, "", null], INVALID_WASTE_CODE),
  transporterCompanySiret: yup
    .string()
    .notRequired()
    .nullable()
    .matches(/^$|^\d{14}$/, {
      message: `Transporteur: ${INVALID_SIRET_LENGTH}`
    }),
  transporterCompanyMail: yup.string().notRequired().nullable().email(),
  transporterValidityLimit: validDatetime({
    verboseFieldName: "date de validité",
    required: false
  })
});
