import { Close } from "common/components/Icons";
import RedErrorMessage from "common/components/RedErrorMessage";
import NumberInput from "form/custom-inputs/NumberInput";
import { Field, FieldArray, FieldProps } from "formik";
import { BsdasriPackagings as PackagingsEnum } from "generated/graphql/types";
import React, { InputHTMLAttributes, useMemo } from "react";
import "./Packagings.scss";

const PACKAGINGS = [
  {
    value: PackagingsEnum.BoiteCarton,
    label: "Caisse en carton avec sac en plastique",
  },
  { value: PackagingsEnum.Fut, label: "Fûts ou jérrican à usage unique" },
  {
    value: PackagingsEnum.BoitePerforants,
    label: " Boîtes et Mini-collecteurs pour déchets perforants",
  },
  { value: PackagingsEnum.GrandEmballage, label: "Grand emballage" },
  { value: PackagingsEnum.Autre, label: "Autre (à préciser)" },
];

export default function Packagings({
  field: { name, value },
  form: { errors },
  id,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  if (!value) {
    return null;
  }

  return (
    <div>
      {!value.length && <span>Le conditionnement doit être défini</span>}
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <div>
            {value.map((p, idx) => (
              <div
                key={`${idx}-${p.type}`}
                className="tw-border-2 tw-border-gray-400 tw-border-solid tw-rounded-md tw-px-4 tw-py-2 tw-mb-2"
              >
                <div className="tw-flex tw-mb-4 tw-items-end">
                  <div className="tw-w-11/12 tw-flex">
                    <div className="tw-w-1/3 tw-pr-2">
                      <label>
                        Type
                        <Field
                          name={`${name}.${idx}.type`}
                          as="select"
                          className="td-select"
                        >
                          {PACKAGINGS.map(packaging => (
                            <option
                              key={packaging.value}
                              value={packaging.value}
                            >
                              {packaging.label}
                            </option>
                          ))}
                        </Field>
                      </label>
                    </div>
                    <div className="tw-w-1/3 tw-px-2">
                      {p.type === "AUTRE" && (
                        <label>
                          Précisez
                          <Field
                            className="td-input"
                            name={`${name}.${idx}.other`}
                            placeholder="..."
                          />
                        </label>
                      )}
                    </div>
                    <div className="tw-w-1/3 tw-px-2">
                      <Field
                        label="Volume"
                        component={NumberInput}
                        className="td-input"
                        name={`${name}.${idx}.volume`}
                        placeholder="Volume en l"
                        min="1"
                      />
                    </div>
                    <div className="tw-w-1/3 tw-px-2">
                      <Field
                        label="Colis"
                        component={NumberInput}
                        className="td-input"
                        name={`${name}.${idx}.quantity`}
                        placeholder="Nombre de colis"
                        min="1"
                      />
                    </div>
                  </div>
                  <div
                    className="tw-px-2"
                    onClick={() => arrayHelpers.remove(idx)}
                  >
                    <button type="button">
                      <Close color="#000" />
                    </button>
                  </div>
                </div>
                <RedErrorMessage name={`${name}.${idx}.type`} />
                <RedErrorMessage name={`${name}.${idx}.other`} />
                <RedErrorMessage name={`${name}.${idx}.quantity`} />
              </div>
            ))}
            <button
              type="button"
              className="btn btn--outline-primary"
              onClick={() =>
                arrayHelpers.push({
                  type: PackagingsEnum.Autre,
                  other: "",
                  quantity: 1,
                })
              }
            >
              Ajouter un conditionnement
            </button>
          </div>
        )}
      />
      {value?.length > 0 && (
        <div className="tw-mt-4">
          Total : {value.reduce((prev, cur) => prev + cur.quantity, 0)} colis -{" "}
          Volume :{" "}
          {value.reduce((prev, cur) => prev + cur.volume * cur.quantity, 0)}{" "}
          litres -{" - "}
          {value
            .map(v => {
              const packaging = PACKAGINGS.find(p => p.value === v.type);
              return `${v.quantity} ${packaging?.label}(s)`;
            })
            .join(", ")}
        </div>
      )}
    </div>
  );
}
