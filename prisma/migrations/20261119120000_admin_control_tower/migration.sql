-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM (
  'LISTING_APPROVED',
  'LISTING_REJECTED',
  'LISTING_CHANGES_REQUESTED',
  'LISTING_PUBLISHED',
  'LISTING_UNPUBLISHED',
  'LISTING_ARCHIVED',
  'AGENT_VERIFIED',
  'AGENT_REJECTED',
  'ROLE_CHANGED'
);

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "agentStatusReason" TEXT,
  ADD COLUMN "agentReviewedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "actorName" TEXT NOT NULL,
  "action" "AuditAction" NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "targetName" TEXT NOT NULL,
  "fromStatus" TEXT,
  "toStatus" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
CREATE INDEX "audit_logs_targetType_targetId_idx" ON "audit_logs"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "audit_logs"
  ADD CONSTRAINT "audit_logs_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
