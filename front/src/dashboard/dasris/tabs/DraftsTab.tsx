import { useQuery, NetworkStatus } from "@apollo/client";
import React from "react";

import { DuplicateFile } from "common/components/Icons";
import { generatePath, Link, useParams } from "react-router-dom";
import { InlineError } from "common/components/Error";
import Loader from "common/components/Loaders";
import { FormStatus, Query, QueryDasriArgs } from "generated/graphql/types";
import { DASRIS_GET } from "../query";

import TabContent from "./TabContent";
import { COLORS } from "common/config";
import Dasris from "../Dasris";
import routes from "common/routes";
import EmptyTab from "../../slips/tabs/EmptyTab";

export default function DraftsTab() {
  const { siret } = useParams<{ siret: string }>();

  const { error, data, fetchMore, refetch, networkStatus } = useQuery<
    Pick<Query, "dasris">,
    Partial<QueryDasriArgs>
  >(DASRIS_GET, {
    notifyOnNetworkStatusChange: true,
  });

  if (networkStatus === NetworkStatus.loading) return <Loader />;
  if (error) return <InlineError apolloError={error} />;

  if (!data?.dasris?.length)
    return (
      <EmptyTab>
        <img src="/illu/illu_empty.svg" alt="" />
        <h4>Il n'y a aucun bordereau en brouillon</h4>
        <p>
          Si vous le souhaitez, vous pouvez{" "}
          <Link to={generatePath(routes.dashboard.slips.create, { siret })}>
            <button className="btn btn--outline-primary btn--medium-text">
              Créer un bordereau
            </button>{" "}
          </Link>
          ou dupliquer un bordereau déjà existant dans un autre onglet grâce à
          l'icône{" "}
          <span style={{ display: "inline" }}>
            <DuplicateFile color={COLORS.blueLight} />
          </span>
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
        hiddenFields={["status", "readableId", "sentAt"]}
        dynamicActions={true}
        refetch={refetch}
      />
    </TabContent>
  );
}
