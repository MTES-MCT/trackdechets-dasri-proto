import { useQuery, NetworkStatus } from "@apollo/client";
import React from "react";
import { InlineError } from "common/components/Error";
import Loader from "common/components/Loaders";

import { DasriStatus, Query, QueryDasrisArgs } from "generated/graphql/types";

import { DASRIS_GET } from "../query";

import TabContent from "./TabContent";
import EmptyTab from "../../slips/tabs/EmptyTab";

import { useParams } from "react-router-dom";

import { BsdTypes } from "common/bsdConstants";
import Dasris from "../Dasris";

export default function ActTab() {
  const { siret } = useParams<{ siret: string }>();

  const statusesWithDynamicActions = [DasriStatus.Sent, DasriStatus.Received];
  const { error, data, fetchMore, refetch, networkStatus } = useQuery<
    Pick<Query, "dasris">,
    Partial<QueryDasrisArgs>
  >(DASRIS_GET, {
    variables: { siret, status: statusesWithDynamicActions },
    notifyOnNetworkStatusChange: true,
  });

  if (networkStatus === NetworkStatus.loading) return <Loader />;
  if (error) return <InlineError apolloError={error} />;
  if (!data?.dasris?.length)
    return (
      <EmptyTab bsdType={BsdTypes.DASRI}>
        <img src="/illu/illu_sent.svg" alt="" />
        <h4>Il n'y a aucun bordereau à signer</h4>
        <p>
          Bonne nouvelle, vous n'avez aucun bordereau à signer ! Des bordereaux
          apparaissent dans cet onglet uniquement lorsque vous avez une action à
          effectuer dans le cadre de leur cycle de vie (envoi, réception ou
          traitement...)
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
