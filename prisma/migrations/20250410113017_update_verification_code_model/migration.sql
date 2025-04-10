/*
  Warnings:

  - You are about to drop the column `twoFactorEnabled` on the `User` table. All the data in the column will be lost.
  - The primary key for the `VerificationCode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expiry` on the `VerificationCode` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `VerificationCode` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFactorEnabled",
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_pkey",
DROP COLUMN "expiry",
DROP COLUMN "used",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VerificationCode_id_seq";

-- CreateIndex
CREATE INDEX "VerificationCode_email_idx" ON "VerificationCode"("email");
