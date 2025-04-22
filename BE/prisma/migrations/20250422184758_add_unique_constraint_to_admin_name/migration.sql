/*
  Warnings:

  - A unique constraint covering the columns `[admin_name]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_name_key" ON "Admin"("admin_name");
