import { useQuery, NetworkStatus } from "@apollo/client";
import React from "react";
import { InlineError } from "common/components/Error";
import Loader from "common/components/Loaders";
import {  Query, QueryBsdasrisArgs } from "generated/graphql/types";
import { DASRI_FOLLOW_TAB } from "./queries";

import Dasris from "../Dasris";

import TabContent from "./TabContent";
import EmptyTab from "../../slips/tabs/EmptyTab";
import { useParams } from "react-router-dom";
import { BsdTypes } from "common/bsdConstants";

export default function FollowTab() {
  const { siret } = useParams<{ siret: string }>();
  const { error, data, fetchMore, refetch, networkStatus } = useQuery<
    Pick<Query, "bsdasris">,
    Partial<QueryBsdasrisArgs>
  >(DASRI_FOLLOW_TAB, {
    variables: {
      siret
 
    },
    notifyOnNetworkStatusChange: true,
  });

  if (networkStatus === NetworkStatus.loading) return <Loader />;
  if (error) return <InlineError apolloError={error} />;
  if (!data?.bsdasris?.length)
    return (
      <EmptyTab bsdType={BsdTypes.DASRI}>
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
      forms={data.bsdasris}
      fetchMore={fetchMore}
    >
      <Dasris
        siret={siret}
        dasris={data.bsdasris}
        dynamicActions={true}
        refetch={refetch}
      />
    </TabContent>
  );
}
