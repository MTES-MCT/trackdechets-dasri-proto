import { useQuery, NetworkStatus } from "@apollo/client";
import React from "react";


import {   useParams } from "react-router-dom";
import { InlineError } from "common/components/Error";
import Loader from "common/components/Loaders";
import { Query, QueryBsdasrisArgs } from "generated/graphql/types";
import { DASRI_DRAFT_TAB } from "./queries";

import TabContent from "./TabContent";
 
import Dasris from "../Dasris";
 
import EmptyTab from "../../slips/tabs/EmptyTab";
import { BsdTypes } from "common/bsdConstants";
export default function DraftsTab() {
  const { siret } = useParams<{ siret: string }>();

  const { error, data, fetchMore, refetch, networkStatus } = useQuery<
    Pick<Query, "bsdasris">,
    Partial<QueryBsdasrisArgs>
  >(DASRI_DRAFT_TAB, {
    variables: { siret },
    notifyOnNetworkStatusChange: true,
  });

  if (networkStatus === NetworkStatus.loading) return <Loader />;
  if (error) return <InlineError apolloError={error} />;

  if (!data?.bsdasris?.edges.length)
    return (
      <EmptyTab bsdType={BsdTypes.DASRI}>
        <img src="/illu/illu_empty.svg" alt="" />
        <h4>Il n'y a aucun bordereau en brouillon</h4>
        {/* <p>
          Si vous le souhaitez, vous pouvez{" "}
          <Link to={generatePath(routes.dashboard.dasris.create, { siret })}>
            <button className="btn btn--outline-primary btn--medium-text">
              Créer un bordereau
            </button>{" "}
          </Link>
          ou dupliquer un bordereau déjà existant dans un autre onglet grâce à
          l'icône{" "}
          <span style={{ display: "inline" }}>
            <DuplicateFile color={COLORS.blueLight} />
          </span>
        </p> */}
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
        hiddenFields={["status", "readableId", "sentAt"]}
        dynamicActions={true}
        refetch={refetch}
      />
    </TabContent>
  );
}
