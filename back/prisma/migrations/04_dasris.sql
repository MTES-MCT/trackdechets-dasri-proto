-- CreateEnum
CREATE TYPE "BsdasriStatus" AS ENUM ('INITIAL', 'SIGNED_BY_PRODUCER', 'SENT', 'RECEIVED', 'REFUSED_BY_RECIPIENT','PROCESSED', 'REFUSED');



-- CreateTable
CREATE TABLE "default$default"."Bsdasri" (
    "id" TEXT NOT NULL,
    "readableId" TEXT NOT NULL,
    "customId" TEXT,
    "status" "BsdasriStatus" NOT NULL DEFAULT E'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "isDraft" BOOLEAN DEFAULT false;
    "emitterCompanyName" TEXT,
    "emitterCompanySiret" TEXT,
    "emitterCompanyAddress" TEXT,
    "emitterCompanyContact" TEXT,
    "emitterCompanyPhone" TEXT,
    "emitterCompanyMail" TEXT,
    "emitterWorkSiteName" TEXT,
    "emitterWorkSiteAddress" TEXT,
    "emitterWorkSiteCity" TEXT,
    "emitterWorkSitePostalCode" TEXT,
    "emitterWorkSiteInfos" TEXT,
    "wasteDetailsCode" TEXT,
    "wasteDetailsOnuCode" TEXT,
    "emitterWasteQuantity" INTEGER,
    "emitterWasteQuantityType" "default$default"."QuantityType",
    "emitterWasteVolume" INTEGER,
    "emitterWastePackagingsInfo" JSONB,
    "emitterCustomInfo" TEXT,
    "handedOverToTransporterAt" TIMESTAMP(3),
    "emissionSignatureAuthor" TEXT,
    "emissionSignatureDate" TIMESTAMP(3),
    "transporterCompanyName" TEXT,
    "transporterCompanySiret" TEXT,
    "transporterCompanyAddress" TEXT,
    "transporterCompanyPhone" TEXT,
    "transporterCompanyContact" TEXT,
    "transporterCompanyMail" TEXT,
    "transporterReceipt" TEXT,
    "transporterReceiptDepartment" TEXT,
    "transporterReceiptValidityLimit" TIMESTAMP(3),
    "transporterWasteAcceptationStatus" "default$default"."WasteAcceptationStatus",
    "transporterWasteRefusalReason" TEXT,
    "transporterWasteRefusedQuantity" INTEGER,
    "transporterTakenOverAt" TIMESTAMP(3),
    "transporterWastePackagingsInfo" JSONB,
    "transporterWasteQuantity" INTEGER,
    "transporterWasteQuantityType" "default$default"."QuantityType",
    "transporterWasteVolume" INTEGER,
    "transporterCustomInfo" TEXT,
    "handedOverToRecipientAt" TIMESTAMP(3),
    "transportSignatureAuthor" TEXT,
    "transportSignatureDate" TIMESTAMP(3),
    "recipientCompanyName" TEXT,
    "recipientCompanySiret" TEXT,
    "recipientCompanyAddress" TEXT,
    "recipientCompanyContact" TEXT,
    "recipientCompanyPhone" TEXT,
    "recipientCompanyMail" TEXT,
    "recipientWastePackagingsInfo" JSONB,
    "recipientWasteAcceptationStatus" "default$default"."WasteAcceptationStatus",
    "recipientWasteRefusalReason" TEXT,
    "recipientWasteRefusedQuantity" INTEGER,
    "recipientWasteQuantity" INTEGER,
    "recipientWasteQuantity" "default$default"."QuantityType",
    "recipientWasteVolume" INTEGER,
    "recipientCustomInfo" TEXT,
    "receivedAt" TIMESTAMP(3),
    "processingOperation" TEXT,
    "processedAt" TIMESTAMP(3),
    "receptionSignatureAuthor" TEXT,
    "receptionSignatureDate" TIMESTAMP(3),
    "operationSignatureDate" TIMESTAMP(3),
    "operationSignatureAuthor" TEXT,


    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS  "Bsdasri.readableId_unique" ON "default$default"."Bsdasri"("readableId");

-- AddForeignKey
ALTER TABLE "default$default"."Bsdasri" ADD FOREIGN KEY("ownerId")REFERENCES "default$default"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
