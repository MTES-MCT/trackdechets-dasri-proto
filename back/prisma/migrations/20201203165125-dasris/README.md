# Migration `20201203165125-dasris`

This migration has been generated by Laurent Paoletti at 12/3/2020, 5:51:25 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."CompanyType" AS ENUM ('PRODUCER', 'COLLECTOR', 'WASTEPROCESSOR', 'TRANSPORTER', 'WASTE_VEHICLES', 'WASTE_CENTER', 'TRADER', 'ECO_ORGANISME')

CREATE TYPE "public"."Seveso" AS ENUM ('NS', 'SB', 'SH')

CREATE TYPE "public"."WasteType" AS ENUM ('INERTE', 'NOT_DANGEROUS', 'DANGEROUS')

CREATE TYPE "public"."GerepType" AS ENUM ('Producteur', 'Traiteur')

CREATE TYPE "public"."WasteAcceptationStatus" AS ENUM ('ACCEPTED', 'REFUSED', 'PARTIALLY_REFUSED')

CREATE TYPE "public"."EmitterType" AS ENUM ('PRODUCER', 'OTHER', 'APPENDIX1', 'APPENDIX2')

CREATE TYPE "public"."QuantityType" AS ENUM ('REAL', 'ESTIMATED')

CREATE TYPE "public"."Consistence" AS ENUM ('SOLID', 'LIQUID', 'GASEOUS', 'DOUGHY')

CREATE TYPE "public"."Status" AS ENUM ('DRAFT', 'SEALED', 'SENT', 'RECEIVED', 'PROCESSED', 'AWAITING_GROUP', 'GROUPED', 'NO_TRACEABILITY', 'REFUSED', 'TEMP_STORED', 'RESEALED', 'RESENT')

CREATE TYPE "public"."TransportMode" AS ENUM ('ROAD', 'RAIL', 'AIR', 'RIVER', 'SEA')

CREATE TYPE "public"."UserRole" AS ENUM ('MEMBER', 'ADMIN')

CREATE TYPE "public"."MembershipRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REFUSED')

CREATE TYPE "public"."AuthType" AS ENUM ('SESSION', 'BEARER', 'JWT')

CREATE TYPE "public"."DasriStatus" AS ENUM ('DRAFT', 'SEALED', 'SENT', 'RECEIVED', 'PROCESSED', 'REFUSED')

CREATE TABLE "AccessToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "lastUsed" TIMESTAMP(3),
    "applicationId" TEXT,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "redirectUris" TEXT[],

    PRIMARY KEY ("id")
)

CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "securityCode" INTEGER NOT NULL,
    "name" TEXT,
    "gerepId" TEXT,
    "codeNaf" TEXT,
    "givenName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "documentKeys" TEXT[],
    "ecoOrganismeAgreements" TEXT[],
    "companyTypes" "CompanyType"[],
    "traderReceiptId" TEXT,
    "transporterReceiptId" TEXT,

    PRIMARY KEY ("id")
)

CREATE TABLE "CompanyAssociation" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Declaration" (
    "id" TEXT NOT NULL,
    "codeS3ic" TEXT,
    "nomEts" TEXT,
    "annee" TEXT,
    "codeDechet" TEXT,
    "libDechet" TEXT,
    "gerepType" "GerepType",

    PRIMARY KEY ("id")
)

CREATE TABLE "EcoOrganisme" (
    "id" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emitterType" "EmitterType",
    "emitterPickupSite" TEXT,
    "emitterCompanyName" TEXT,
    "emitterCompanySiret" TEXT,
    "emitterCompanyAddress" TEXT,
    "emitterCompanyContact" TEXT,
    "emitterCompanyPhone" TEXT,
    "emitterCompanyMail" TEXT,
    "recipientCap" TEXT,
    "recipientProcessingOperation" TEXT,
    "recipientCompanyName" TEXT,
    "recipientCompanySiret" TEXT,
    "recipientCompanyAddress" TEXT,
    "recipientCompanyContact" TEXT,
    "recipientCompanyPhone" TEXT,
    "recipientCompanyMail" TEXT,
    "transporterCompanyName" TEXT,
    "transporterCompanySiret" TEXT,
    "transporterCompanyAddress" TEXT,
    "transporterCompanyContact" TEXT,
    "transporterCompanyPhone" TEXT,
    "transporterCompanyMail" TEXT,
    "transporterReceipt" TEXT,
    "transporterDepartment" TEXT,
    "transporterValidityLimit" TIMESTAMP(3),
    "transporterNumberPlate" TEXT,
    "wasteDetailsCode" TEXT,
    "wasteDetailsOnuCode" TEXT,
    "wasteDetailsPackagingInfos" JSONB,
    "wasteDetailsPackagings" JSONB,
    "wasteDetailsOtherPackaging" TEXT,
    "wasteDetailsNumberOfPackages" INTEGER,
    "wasteDetailsQuantity" DECIMAL(65,30),
    "wasteDetailsQuantityType" "QuantityType",
    "readableId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'DRAFT',
    "sentAt" TIMESTAMP(3),
    "sentBy" TEXT,
    "isAccepted" BOOLEAN DEFAULT false,
    "receivedAt" TIMESTAMP(3),
    "quantityReceived" DECIMAL(65,30),
    "processingOperationDone" TEXT,
    "wasteDetailsName" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "receivedBy" TEXT,
    "wasteDetailsConsistence" "Consistence",
    "processedBy" TEXT,
    "processedAt" TEXT,
    "nextDestinationProcessingOperation" TEXT,
    "traderCompanyName" TEXT,
    "traderCompanySiret" TEXT,
    "traderCompanyAddress" TEXT,
    "traderCompanyContact" TEXT,
    "traderCompanyPhone" TEXT,
    "traderCompanyMail" TEXT,
    "traderReceipt" TEXT,
    "traderDepartment" TEXT,
    "traderValidityLimit" TIMESTAMP(3),
    "processingOperationDescription" TEXT,
    "noTraceability" BOOLEAN,
    "signedByTransporter" BOOLEAN,
    "transporterIsExemptedOfReceipt" BOOLEAN,
    "customId" TEXT,
    "wasteAcceptationStatus" "WasteAcceptationStatus",
    "wasteRefusalReason" TEXT,
    "nextDestinationCompanyName" TEXT,
    "nextDestinationCompanySiret" TEXT,
    "nextDestinationCompanyAddress" TEXT,
    "nextDestinationCompanyContact" TEXT,
    "nextDestinationCompanyPhone" TEXT,
    "nextDestinationCompanyMail" TEXT,
    "emitterWorkSiteName" TEXT,
    "emitterWorkSiteAddress" TEXT,
    "emitterWorkSiteCity" TEXT,
    "emitterWorkSitePostalCode" TEXT,
    "emitterWorkSiteInfos" TEXT,
    "transporterCustomInfo" TEXT,
    "recipientIsTempStorage" BOOLEAN DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "currentTransporterSiret" TEXT,
    "nextTransporterSiret" TEXT,
    "nextDestinationCompanyCountry" TEXT,
    "isImportedFromPaper" BOOLEAN NOT NULL DEFAULT false,
    "ecoOrganismeName" TEXT,
    "ecoOrganismeSiret" TEXT,
    "signedBy" TEXT,
    "temporaryStorageDetailId" TEXT,
    "appendix2RootFormId" TEXT,
    "ownerId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Grant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "expires" INTEGER NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Installation" (
    "id" TEXT NOT NULL,
    "codeS3ic" TEXT,
    "nomEts" TEXT,
    "regime" TEXT,
    "libRegime" TEXT,
    "seveso" "Seveso",
    "libSeveso" TEXT,
    "familleIc" TEXT,
    "urlFiche" TEXT,
    "s3icNumeroSiret" TEXT,
    "irepNumeroSiret" TEXT,
    "gerepNumeroSiret" TEXT,
    "sireneNumeroSiret" TEXT,

    PRIMARY KEY ("id")
)

CREATE TABLE "MembershipRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "MembershipRequestStatus" NOT NULL DEFAULT E'PENDING',
    "statusUpdatedBy" TEXT,
    "sentTo" TEXT[],
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Rubrique" (
    "id" TEXT NOT NULL,
    "codeS3ic" TEXT,
    "rubrique" TEXT,
    "alinea" TEXT,
    "dateAutorisation" TEXT,
    "etatActivite" TEXT,
    "regimeAutorise" TEXT,
    "activite" TEXT,
    "volume" TEXT,
    "unite" TEXT,
    "category" TEXT,
    "wasteType" "WasteType",

    PRIMARY KEY ("id")
)

CREATE TABLE "StatusLog" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "loggedAt" TIMESTAMP(3),
    "updatedFields" JSONB NOT NULL,
    "formId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authType" "AuthType" NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "TemporaryStorageDetail" (
    "id" TEXT NOT NULL,
    "tempStorerQuantityType" "QuantityType",
    "tempStorerQuantityReceived" DECIMAL(65,30),
    "tempStorerWasteAcceptationStatus" "WasteAcceptationStatus",
    "tempStorerWasteRefusalReason" TEXT,
    "tempStorerReceivedAt" TIMESTAMP(3),
    "tempStorerReceivedBy" TEXT,
    "tempStorerSignedAt" TIMESTAMP(3),
    "tempStorerSignedBy" TEXT,
    "destinationIsFilledByEmitter" BOOLEAN DEFAULT true,
    "destinationCompanyName" TEXT,
    "destinationCompanySiret" TEXT,
    "destinationCompanyAddress" TEXT,
    "destinationCompanyContact" TEXT,
    "destinationCompanyPhone" TEXT,
    "destinationCompanyMail" TEXT,
    "destinationCap" TEXT,
    "destinationProcessingOperation" TEXT,
    "wasteDetailsOnuCode" TEXT,
    "wasteDetailsPackagingInfos" JSONB,
    "wasteDetailsPackagings" JSONB,
    "wasteDetailsOtherPackaging" TEXT,
    "wasteDetailsNumberOfPackages" INTEGER,
    "wasteDetailsQuantity" DECIMAL(65,30),
    "wasteDetailsQuantityType" "QuantityType",
    "transporterCompanyName" TEXT,
    "transporterCompanySiret" TEXT,
    "transporterCompanyAddress" TEXT,
    "transporterCompanyContact" TEXT,
    "transporterCompanyPhone" TEXT,
    "transporterCompanyMail" TEXT,
    "transporterIsExemptedOfReceipt" BOOLEAN,
    "transporterReceipt" TEXT,
    "transporterDepartment" TEXT,
    "transporterValidityLimit" TIMESTAMP(3),
    "transporterNumberPlate" TEXT,
    "signedByTransporter" BOOLEAN,
    "signedBy" TEXT,
    "signedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
)

CREATE TABLE "TraderReceipt" (
    "id" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "validityLimit" TIMESTAMP(3) NOT NULL,
    "department" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "TransporterReceipt" (
    "id" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "validityLimit" TIMESTAMP(3) NOT NULL,
    "department" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "TransportSegment" (
    "id" TEXT NOT NULL,
    "segmentNumber" INTEGER,
    "transporterCompanySiret" TEXT,
    "transporterCompanyName" TEXT,
    "transporterCompanyAddress" TEXT,
    "transporterCompanyContact" TEXT,
    "transporterCompanyPhone" TEXT,
    "transporterCompanyMail" TEXT,
    "transporterIsExemptedOfReceipt" BOOLEAN,
    "transporterReceipt" TEXT,
    "transporterDepartment" TEXT,
    "transporterValidityLimit" TIMESTAMP(3),
    "transporterNumberPlate" TEXT,
    "mode" "TransportMode",
    "readyToTakeOver" BOOLEAN DEFAULT false,
    "previousTransporterCompanySiret" TEXT,
    "takenOverAt" TIMESTAMP(3),
    "takenOverBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    "applicationId" TEXT,

    PRIMARY KEY ("id")
)

CREATE TABLE "UserAccountHash" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companySiret" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL,
    "acceptedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
)

CREATE TABLE "UserActivationHash" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "DasriForm" (
    "id" TEXT NOT NULL,
    "readableId" TEXT NOT NULL,
    "status" "DasriStatus" NOT NULL DEFAULT E'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
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
    "emitterWasteQuantityType" "QuantityType",
    "emitterWasteVolume" INTEGER,
    "emitterWastePackagingsInfo" JSONB,
    "handedOverToTransporterAt" TIMESTAMP(3),
    "emitterSignedBy" TEXT,
    "emitterSignedAt" TIMESTAMP(3),
    "transporterCompanyName" TEXT,
    "transporterCompanySiret" TEXT,
    "transporterCompanyAddress" TEXT,
    "transporterCompanyPhone" TEXT,
    "transporterCompanyMail" TEXT,
    "transporterReceipt" TEXT,
    "transporterDepartment" TEXT,
    "transporterValidityLimit" TIMESTAMP(3),
    "transporterWasteAcceptationStatus" "WasteAcceptationStatus",
    "transporterWasteRefusalReason" TEXT,
    "transporterWasteRefusedQuantity" INTEGER,
    "transporterTakenOverAt" TIMESTAMP(3),
    "transporterWastePackagingsInfo" JSONB,
    "transporterWasteQuantity" INTEGER,
    "transporterWasteQuantityType" "QuantityType",
    "transporterWasteVolume" INTEGER,
    "handedOverToRecipientAt" TIMESTAMP(3),
    "transporterSignedBy" TEXT,
    "transporterSignedAt" TIMESTAMP(3),
    "recipientCompanyName" TEXT,
    "recipientCompanySiret" TEXT,
    "recipientCompanyAddress" TEXT,
    "recipientCompanyContact" TEXT,
    "recipientCompanyPhone" TEXT,
    "recipientCompanyMail" TEXT,
    "recipientWastePackagingsInfo" JSONB,
    "recipientWasteAcceptationStatus" "WasteAcceptationStatus",
    "recipientWasteRefusalReason" TEXT,
    "recipientWasteRefusedQuantity" INTEGER,
    "recipientWasteQuantity" INTEGER,
    "recipientWasteVolume" INTEGER,
    "receivedAt" TIMESTAMP(3),
    "processingOperation" TEXT,
    "processedAt" TIMESTAMP(3),
    "recipientSignedBy" TEXT,
    "recipientSignedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "AccessToken.token_unique" ON "AccessToken"("token")

CREATE UNIQUE INDEX "Company.siret_unique" ON "Company"("siret")

CREATE INDEX "declaration_codes3ic" ON "Declaration"("codeS3ic")

CREATE UNIQUE INDEX "EcoOrganisme.siret_unique" ON "EcoOrganisme"("siret")

CREATE UNIQUE INDEX "Form.readableId_unique" ON "Form"("readableId")

CREATE UNIQUE INDEX "Form.temporaryStorageDetailId_unique" ON "Form"("temporaryStorageDetailId")

CREATE UNIQUE INDEX "Grant.code_unique" ON "Grant"("code")

CREATE INDEX "installation_gerepnumerosiret" ON "Installation"("gerepNumeroSiret")

CREATE INDEX "installation_irepnumerosiret" ON "Installation"("irepNumeroSiret")

CREATE INDEX "installation_s3icnumerosiret" ON "Installation"("s3icNumeroSiret")

CREATE INDEX "installation_sirenenumerosiret" ON "Installation"("sireneNumeroSiret")

CREATE INDEX "rubrique_codes3ic" ON "Rubrique"("codeS3ic")

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

CREATE UNIQUE INDEX "UserAccountHash.hash_unique" ON "UserAccountHash"("hash")

CREATE UNIQUE INDEX "UserActivationHash.hash_unique" ON "UserActivationHash"("hash")

CREATE UNIQUE INDEX "DasriForm.readableId_unique" ON "DasriForm"("readableId")

ALTER TABLE "AccessToken" ADD FOREIGN KEY("applicationId")REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "AccessToken" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Company" ADD FOREIGN KEY("traderReceiptId")REFERENCES "TraderReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Company" ADD FOREIGN KEY("transporterReceiptId")REFERENCES "TransporterReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "CompanyAssociation" ADD FOREIGN KEY("companyId")REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "CompanyAssociation" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Form" ADD FOREIGN KEY("temporaryStorageDetailId")REFERENCES "TemporaryStorageDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Form" ADD FOREIGN KEY("appendix2RootFormId")REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Form" ADD FOREIGN KEY("ownerId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Grant" ADD FOREIGN KEY("applicationId")REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Grant" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "MembershipRequest" ADD FOREIGN KEY("companyId")REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "MembershipRequest" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "StatusLog" ADD FOREIGN KEY("formId")REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "StatusLog" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "TransportSegment" ADD FOREIGN KEY("formId")REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "User" ADD FOREIGN KEY("applicationId")REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "UserActivationHash" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "DasriForm" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201203142050-dasris..20201203165125-dasris
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 enum CompanyType {
   PRODUCER
@@ -533,8 +533,10 @@
   // transport
   transporterWasteAcceptationStatus  WasteAcceptationStatus?
   transporterWasteRefusalReason      String?
+  transporterWasteRefusedQuantity      Int? // kg
+
   transporterTakenOverAt          DateTime?
   transporterWastePackagingsInfo        Json?
   transporterWasteQuantity           Int? // kg
@@ -554,16 +556,19 @@
   recipientCompanyPhone              String?
   recipientCompanyMail               String?
   // reception
-  recipientSignedBy                  String?
-  recipientSignedAt                  DateTime?
+
   recipientWastePackagingsInfo          Json?
   recipientWasteAcceptationStatus    WasteAcceptationStatus?
   recipientWasteRefusalReason        String?
-  recipientWasteRefusalQuantity      Int? // kg
+  recipientWasteRefusedQuantity      Int? // kg
   recipientWasteQuantity             Int? // kg
+  recipientWasteVolume             Int? // liters
   receivedAt                         DateTime? // accepted or refused date
   processingOperation       String?
   processedAt               DateTime?
+
+    recipientSignedBy                  String?
+  recipientSignedAt                  DateTime?
 }
```

