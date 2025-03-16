/*
  Warnings:

  - You are about to drop the column `userId` on the `Bookmark` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_contestId_fkey";

-- DropIndex
DROP INDEX "Bookmark_contestId_userId_key";

-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "userId";
