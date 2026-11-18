-- CreateEnum
CREATE TYPE "ListingIntent" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "agentStatus" "AgentStatus" DEFAULT 'PENDING',
  ADD COLUMN "agencyName" TEXT,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "verifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "listings"
  ADD COLUMN "intent" "ListingIntent" NOT NULL DEFAULT 'SALE',
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "rejectionReason" TEXT;

-- AlterTable
ALTER TABLE "inquiries"
  ALTER COLUMN "buyerId" DROP NOT NULL,
  ADD COLUMN "name" TEXT,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "phone" TEXT;

-- CreateTable
CREATE TABLE "listing_views" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "referrer" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "listing_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listings_agentId_idx" ON "listings"("agentId");

-- CreateIndex
CREATE INDEX "listings_status_intent_type_idx" ON "listings"("status", "intent", "type");

-- CreateIndex
CREATE INDEX "listings_createdAt_idx" ON "listings"("createdAt");

-- CreateIndex
CREATE INDEX "listing_views_listingId_createdAt_idx" ON "listing_views"("listingId", "createdAt");

-- AddForeignKey
ALTER TABLE "listing_views"
  ADD CONSTRAINT "listing_views_listingId_fkey"
  FOREIGN KEY ("listingId") REFERENCES "listings"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill intent from the JSON attribute used before the column existed
UPDATE "listings"
SET "intent" = 'RENT'
WHERE lower(coalesce("attributes" ->> 'transactionType', '')) IN ('rent', 'short-let');

-- Backfill publishedAt for rows that are already live
UPDATE "listings"
SET "publishedAt" = coalesce("updatedAt", "createdAt")
WHERE "status" = 'PUBLISHED' AND "publishedAt" IS NULL;
