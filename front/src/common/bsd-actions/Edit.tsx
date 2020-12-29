import React from "react";

import { PaperWriteIcon } from "common/components/Icons";

import { generatePath, Link, useParams } from "react-router-dom";
import { COLORS } from "common/config";
import routes from "common/routes";

import { bsdTypes } from "common/types";
type Props = { bsdType: bsdTypes; bsdId: string; small?: boolean };

const editRoutes = { dasri: routes.dashboard.dasris.edit };

export default function Edit({ bsdId, bsdType, small = true }: Props) {
  const { siret } = useParams<{ siret: string }>();
  const className = small
    ? "slips-actions__button"
    : "btn btn--outline-primary";

  return (
    <Link
      to={generatePath(editRoutes[bsdType], { siret, id: bsdId })}
      title="Modifier"
      className={className}
    >
      <PaperWriteIcon size={24} color={COLORS.blueLight} />
      <span>Modifier</span>
    </Link>
  );
}
