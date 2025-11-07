/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Place` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Place_name_key" ON "Place"("name");
