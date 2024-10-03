/*
  Warnings:

  - Changed the type of `game` on the `master_games` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "master_games" DROP COLUMN "game",
ADD COLUMN     "game" JSONB NOT NULL;
