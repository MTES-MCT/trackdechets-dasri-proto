import { format } from "date-fns";
import QRCode from "qrcode";
import { join } from "path";
import ejs from "ejs";
import prisma from "../prisma";
import { checkCanReadBsdasri } from "./permissions";

const dasriPdfHandler = async (req, res) => {
  const { bsdasriId } = req.params;

  if (!req.user) {
    return res.status(401).send("Vous nêtes pas authentifié");
  }
  const { user } = req;
  if (typeof bsdasriId !== "string") {
    return res.status(400).send("Le format d'identifiant est invalide");
  }

  const bsdasri = await prisma.bsdasri.findUnique({
    where: { id: bsdasriId }
  });
  if (bsdasri == null || bsdasri.isDeleted == true) {
    return res.status(404).send("Ce bordereau n'existe pas");
  }
  await checkCanReadBsdasri(user, bsdasri);
  const qrcode = !bsdasri.isDraft
    ? await QRCode.toString(bsdasri.id, { type: "svg" })
    : "";

  const tplPath = join(__dirname, "/templates/dasri.ejs");

  const rendered = await ejs.renderFile(
    tplPath,
    { bsdasri, qrcode, sumPackageQuantity, dateFmt: safeDateFmt },
    { error: false }
  );

  res.send(rendered);
};

export default dasriPdfHandler;

const safeDateFmt = dt => {
  if (!dt) {
    return "";
  }
  return format(dt, "dd/MM/yyyy");
};

const sumPackageQuantity = packagingInfos => {
  if (!packagingInfos) {
    return "";
  }
  return packagingInfos
    .map(info => info.quantity)
    .reduce((acc, val) => acc + val, 0);
};
