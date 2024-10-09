/*
  Warnings:

  - You are about to drop the column `useremail` on the `master_users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usermail]` on the table `master_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usermail` to the `master_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "master_users_useremail_key";

-- AlterTable
ALTER TABLE "master_users" DROP COLUMN "useremail",
ADD COLUMN     "usermail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "master_users_usermail_key" ON "master_users"("usermail");
