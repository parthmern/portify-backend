/*
  Warnings:

  - You are about to drop the column `links` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "links",
ADD COLUMN     "githubRepoLink" TEXT,
ADD COLUMN     "liveLink" TEXT,
ADD COLUMN     "otherLink" TEXT;
