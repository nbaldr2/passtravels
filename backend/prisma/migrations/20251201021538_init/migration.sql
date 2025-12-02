-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passportCode" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passport" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "mobilityScore" INTEGER NOT NULL,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "region" TEXT,
    "description" TEXT,
    "safetyScore" DOUBLE PRECISION,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaRule" (
    "id" TEXT NOT NULL,
    "originPassportId" TEXT NOT NULL,
    "destinationCountryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER,
    "notes" TEXT,

    CONSTRAINT "VisaRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EVisaLink" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "officialUrl" TEXT,
    "portalUrl" TEXT,

    CONSTRAINT "EVisaLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destinationId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budget" DOUBLE PRECISION,
    "itineraryJson" JSONB,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Passport_countryCode_key" ON "Passport"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "VisaRule_originPassportId_destinationCountryId_key" ON "VisaRule"("originPassportId", "destinationCountryId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_countryId_key" ON "Favorite"("userId", "countryId");

-- AddForeignKey
ALTER TABLE "VisaRule" ADD CONSTRAINT "VisaRule_originPassportId_fkey" FOREIGN KEY ("originPassportId") REFERENCES "Passport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaRule" ADD CONSTRAINT "VisaRule_destinationCountryId_fkey" FOREIGN KEY ("destinationCountryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVisaLink" ADD CONSTRAINT "EVisaLink_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
