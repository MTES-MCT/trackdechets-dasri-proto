import { useQuery, NetworkStatus } from "@apollo/client";
import React from "react";
import { InlineError } from "common/components/Error";
import Loader from "common/components/Loaders";

import { Query, QueryBsdasrisArgs } from "generated/graphql/types";

import { DASRI_ACT_TAB } from "./queries";

import TabContent from "./TabContent";
import EmptyTab from "../../slips/tabs/EmptyTab";

import { useParams } from "react-router-dom";

import { BsdTypes } from "common/bsdConstants";
import Dasris from "../Dasris";

export default function ActTab() {
  const { siret } = useParams<{ siret: string }>();

  const { error, data, fetchMore, refetch, networkStatus } = useQuery<
    Pick<Query, "bsdasris">,
    Partial<QueryBsdasrisArgs>
  >(DASRI_ACT_TAB, {
    variables: { siret },
  });

  if (networkStatus === NetworkStatus.loading) return <Loader />;
  if (error) return <InlineError apolloError={error} />;
  if (!data?.bsdasris?.edges.length)
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
      forms={data.bsdasris}
      fetchMore={fetchMore}
    >
      <Dasris
        siret={siret}
        dasris={data.bsdasris.edges}
        dynamicActions={true}
        refetch={refetch}
      />
    </TabContent>
  );
}
