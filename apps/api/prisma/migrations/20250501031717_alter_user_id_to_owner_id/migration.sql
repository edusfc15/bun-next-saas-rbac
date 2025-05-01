/*
  Warnings:

  - You are about to drop the column `user_id` on the `organizations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_user_id_fkey";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "user_id",
ADD COLUMN     "ownerId" TEXT;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
