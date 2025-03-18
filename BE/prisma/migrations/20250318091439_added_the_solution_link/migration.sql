/*
  Warnings:

  - You are about to drop the `Solution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_contestId_fkey";

-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "solution" TEXT DEFAULT 'https://www.youtube.com/';

-- DropTable
DROP TABLE "Solution";
