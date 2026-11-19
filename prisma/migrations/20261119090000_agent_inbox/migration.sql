-- AlterTable
ALTER TABLE "inquiries"
  ADD COLUMN "agentNote" TEXT,
  ADD COLUMN "lastContactedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "inquiries_listingId_status_idx" ON "inquiries"("listingId", "status");
