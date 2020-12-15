import { Field, useFormikContext } from "formik";
import React, { useState, useEffect } from "react";
import { Form } from "generated/graphql/types";
import WorkSiteAddress from "./WorkSiteAddress";
import TdSwitch from "common/components/Switch";
const FIELDS = ["name", "address", "city", "postalCode", "infos"];

const captionsConfig = {
  form: { triggerTitle: "", title: "", nameLabel: "Nom de l'entreprise" },
  dasri: {
    triggerTitle: "Je souhaite ajouter une adresse de collecte",
    title: "Adresse de collecte",
    nameLabel: "Nom ou référence (noms de personnes physiques interdits, secret médical)",
  },
};

export default function CollectSite({ bsdType }) {
  const captions = captionsConfig[bsdType];
  const { values, setFieldValue } = useFormikContext<Form>();
  const [showWorkSite, setShowWorkSite] = useState(
    FIELDS.some(field =>
      values.emitter?.workSite ? values.emitter?.workSite[field] : null
    )
  );

  useEffect(() => {
    if (!showWorkSite) {
      for (const field of FIELDS) {
        setFieldValue(`emitter.workSite.${field}`, "");
      }
    }
  }, [showWorkSite, setFieldValue]);

  function setAddress(details) {
    setFieldValue(`emitter.workSite.address`, details.name);
    setFieldValue(`emitter.workSite.city`, details.city);
    setFieldValue(`emitter.workSite.postalCode`, details.postcode);
  }

  return (
    <div className="form__row">
      <TdSwitch
        checked={showWorkSite}
        onChange={() => setShowWorkSite(!showWorkSite)}
        label={captions.triggerTitle}
      />

      {showWorkSite && (
        <>
          <h4 className="form__section-heading">{captions.title}</h4>

          <div className="form__row">
            <label>
              {captions.nameLabel}
              <Field
                type="text"
                name="emitter.workSite.name"
                placeholder="Intitulé"
                className="td-input"
              />
            </label>
          </div>

          <div className="form__row">
            <WorkSiteAddress
              adress={values.emitter?.workSite?.address}
              city={values.emitter?.workSite?.city}
              postalCode={values.emitter?.workSite?.postalCode}
              onAddressSelection={details => setAddress(details)}
              caption={captions.title}
            />
          </div>

          <div className="form__row">
            <label>
              Autre informations
              <Field
                component="textarea"
                className="textarea-pickup-site td-textarea"
                placeholder="Champ libre pour préciser..."
                name="emitter.workSite.infos"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
