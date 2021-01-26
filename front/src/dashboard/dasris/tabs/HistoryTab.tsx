import { useQuery, NetworkStatus } from "@apollo/client";
import React from "react";
import { InlineError } from "common/components/Error";
import Loader from "common/components/Loaders";
import { FormStatus, Query, QueryFormsArgs } from "generated/graphql/types";
import { DASRI_ARCHIVE_TAB } from "./queries";
import EmptyTab from "../../slips/tabs/EmptyTab";

import Dasris from "../Dasris";

import { BsdTypes } from "common/bsdConstants";

import TabContent from "./TabContent";
import { useParams } from "react-router-dom";

export default function HistoryTab() {
  const { siret } = useParams<{ siret: string }>();
  const { error, data, fetchMore, refetch, networkStatus } = useQuery<
    Pick<Query, "dasris">,
    Partial<QueryFormsArgs>
  >(DASRI_ARCHIVE_TAB, {
    variables: {
      siret,
    
    },
    notifyOnNetworkStatusChange: true,
  });

  if (networkStatus === NetworkStatus.loading) return <Loader />;
  if (error) return <InlineError apolloError={error} />;
  if (!data?.dasris?.length)
    return (
      <EmptyTab bsdType={BsdTypes.DASRI}>
        <img src="/illu/illu_hello.svg" alt="" />
        <h4>Il n'y a aucun bordereau en archive</h4>
        <p>
          Des bordereaux apparaissent dans cet onnglet lorsqu'ils terminé leur
          cycle de vie. Ils sont alors disponible en lecture seule pour
          consultation.
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
      <Dasris siret={siret} dasris={data.dasris} />
    </TabContent>
  );
}
