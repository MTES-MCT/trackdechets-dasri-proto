import { useQuery, NetworkStatus } from "@apollo/client";
import React from "react";
import { InlineError } from "common/components/Error";
import Loader from "common/components/Loaders";
import { DasriStatus, Query, QueryDasrisArgs } from "generated/graphql/types";
import { DASRIS_GET } from "../query";
import Dasris from "../Dasris";

import TabContent from "./TabContent";
import EmptyTab from "../../slips/tabs/EmptyTab";
import { useParams } from "react-router-dom";
import { BsdTypes } from "common/bsdConstants";

export default function FollowTab() {
  const { siret } = useParams<{ siret: string }>();
  const { error, data, fetchMore, refetch, networkStatus } = useQuery<
    Pick<Query, "dasris">,
    Partial<QueryDasrisArgs>
  >(DASRIS_GET, {
    variables: {
      siret,
      status: [DasriStatus.Sealed, DasriStatus.Sent, DasriStatus.Received],
    },
    notifyOnNetworkStatusChange: true,
  });

  if (networkStatus === NetworkStatus.loading) return <Loader />;
  if (error) return <InlineError apolloError={error} />;
  if (!data?.dasris?.length)
    return (
      <EmptyTab bsdType={BsdTypes.FORM}>
        <img src="/illu/illu_transfer.svg" alt="" />
        <h4>Il n'y a aucun bordereau à suivre</h4>
        <p>
          Des bordereaux apparaissent dans cet onglet lorsqu'ils sont en attente
          d'une action extérieure. Par exemple lorsqu'en tant que producteur
          vous attendez la réception d'un déchet ou son traitement. La colonne{" "}
          <strong>STATUT</strong> vous renseignera sur l'état précis du
          bordereau.
        </p>
      </EmptyTab>
    );

  return (
    <TabContent
      networkStatus={networkStatus}
      refetch={refetch}
      forms={data.dasris}
      fetchMore={fetchMore}
    >
      <Dasris
        siret={siret}
        dasris={data.dasris}
        dynamicActions={true}
        refetch={refetch}
      />
    </TabContent>
  );
}
