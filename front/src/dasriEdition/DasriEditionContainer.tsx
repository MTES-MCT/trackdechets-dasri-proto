import React from "react";
import Emitter from "./Emitter";
import Recipient from "./Recipient";
import { StepContainer } from "./stepper/Step";
import StepList from "./stepper/StepList";
import Transporter from "./Transporter";
import DasriWasteDetail from "./WasteDetail";
import { useParams } from "react-router-dom";

export default function DasriEditionContainer() {
  const { id } = useParams<{ id?: string }>();
  return (
    <main className="main">
      <div className="container">
        <StepList bsdId={id}>
          <StepContainer component={Emitter} title="Producteur" />
          <StepContainer
            component={DasriWasteDetail}
            title="Détail du déchet"
          />

          <StepContainer component={Transporter} title="Transporteur" />

          <StepContainer component={Recipient} title="Destinataire" />
        </StepList>
      </div>
    </main>
  );
}
