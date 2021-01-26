enum DasriProcessingOperationType {
  Incineration = "INCINERATION",
  IncinerationValorisation = "INCINERATIONVALORISATION",
  Pretraitement = "PRETRAITEMENT"
}

export const DASRI_WASTE_CODES = [
  {
    code: "18 01 03*",
    description: "DASRI d'origine humaine"
  },
  {
    code: "18 01 02*",
    description: "DASRI d'origine animale"
  }
];
export const DASRI_PROCESSING_OPERATIONS = [
  {
    type: DasriProcessingOperationType.Incineration,
    code: "D10",
    description: "DASRI d'origine humaine"
  },
  {
    type: DasriProcessingOperationType.IncinerationValorisation,
    code: "R1",
    description: "DASRI d'origine animale"
  },
  {
    type: DasriProcessingOperationType.Pretraitement,
    code: "D9",
    description: "Pretraitement par désinfection"
  }
];
export const DASRI_PROCESSING_OPERATIONS_CODES: string[] = DASRI_PROCESSING_OPERATIONS.map(
  operation => operation.code
);
