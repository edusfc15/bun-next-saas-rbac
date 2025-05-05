/*
  Warnings:

  - Made the column `ownerId` on table `organizations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_fkey";

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
