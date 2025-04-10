/*
  Warnings:

  - The primary key for the `VerificationCode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `type` on the `VerificationCode` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationCode` table. All the data in the column will be lost.
  - The `id` column on the `VerificationCode` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "VerificationCode_email_idx";

-- AlterTable
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_pkey",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
