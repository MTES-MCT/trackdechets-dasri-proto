import {
  string,
  object,
  date,
  number,
  array,
  boolean,
  setLocale,
  LocaleObject,
  StringSchema,
  mixed,
  ObjectSchema,
} from "yup";
import countries from "world-countries";

import { isDangerous } from "generated/constants";
import {
  PackagingInfo,
  Packagings,
  Consistence,
  WasteAcceptationStatusInput as WasteAcceptationStatus,
} from "generated/graphql/types";

setLocale({
  mixed: {
    notType: "Ce champ ne peut pas être nul",
  },
} as LocaleObject);

const companySchema = object().shape({
  name: string().required(),
  siret: string().when("country", {
    is: country => country == null || country === "FR",
    then: string().required("La sélection d'une entreprise est obligatoire"),
    otherwise: string().nullable(),
  }),
  address: string().required(),
  country: string()
    .oneOf([
      ...countries.map(country => country.cca2),

      // .oneOf() has a weird behavior with .nullable(), see:
      // https://github.com/jquense/yup/issues/104
      null,
    ])
    .nullable(),
  contact: string().required("Le contact dans l'entreprise est obligatoire"),
  phone: string().required("Le téléphone de l'entreprise est obligatoire"),
  mail: string()
    .email("Le format d'adresse email est incorrect")
    .required("L'email est obligatoire"),
});

const packagingInfo: ObjectSchema<PackagingInfo> = object().shape({
  type: mixed<Packagings>().required(
    "Le type de conditionnement doit être précisé."
  ),
  other: string().when("type", (type, schema) =>
    type === "AUTRE"
      ? schema.required(
          "La description doit être précisée pour le conditionnement 'AUTRE'."
        )
      : schema
          .nullable()
          .max(
            0,
            "Le description du conditionnement ne peut être renseignée que lorsque le type de conditionnement est 'AUTRE'."
          )
  ),
  quantity: number()
    .required(
      "Le nombre de colis associé au conditionnement doit être précisé."
    )
    .integer()
    .min(1, "Le nombre de colis doit être supérieur à 0.")
    .when("type", (type, schema) =>
      ["CITERNE", "BENNE"].includes(type)
        ? schema.max(
            1,
            "Le nombre de benne ou de citerne ne peut être supérieur à 1."
          )
        : schema
    ),
});

export const dasriSchema = object().shape({
  id: string().required(),
  emitter: object().shape({
    type: string().matches(/PRODUCER/),
    workSite: object({
      name: string().nullable(),
      address: string().nullable(),
      city: string().nullable(),
      postalCode: string().nullable(),
      infos: string().nullable(),
    }).nullable(),
    company: companySchema,
  }),
  recipient: object().shape({
    company: companySchema,
  }),
  transporter: object().shape({
    receipt: string().when(
      "isExemptedOfReceipt",
      (isExemptedOfReceipt: boolean, schema: StringSchema) =>
        isExemptedOfReceipt
          ? schema.nullable(true)
          : schema.required(
              "Vous n'avez pas précisé bénéficier de l'exemption de récépissé, il est donc est obligatoire"
            )
    ),
    department: string().when(
      "isExemptedOfReceipt",
      (isExemptedOfReceipt: boolean, schema: StringSchema) =>
        isExemptedOfReceipt
          ? schema.nullable(true)
          : schema.required("Le département du transporteur est obligatoire")
    ),
    validityLimit: date().nullable(true),

    company: companySchema,
  }),
});
 