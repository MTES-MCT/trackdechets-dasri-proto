import React from "react";
import SlipDetailContent from "./SlipDetailContent";
import Loader from "common/components/Loaders";
import { useQuery } from "@apollo/client";
import { Query, QueryBsdasriArgs } from "generated/graphql/types";
import { useParams } from "react-router-dom";
import { DASRI_GET } from "dashboard/dasris/queries";
import { InlineError } from "common/components/Error";

export default function SlipDetail() {
  const { id: formId } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<
    Pick<Query, "bsdasri">,
    QueryBsdasriArgs
  >(DASRI_GET, {
    variables: {
      id: formId,
      readableId: null,
    },
    skip: !formId,
    fetchPolicy: "network-only",
  });
  const bsdasri = data?.bsdasri;
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <InlineError apolloError={error} />;
  }
  return (
    <div>
      <SlipDetailContent form={bsdasri} />
    </div>
  );
}
