/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Contest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Solution" (
    "id" SERIAL NOT NULL,
    "contestId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solution_contestId_key" ON "Solution"("contestId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_contestId_userId_key" ON "Bookmark"("contestId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_url_key" ON "Contest"("url");

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
