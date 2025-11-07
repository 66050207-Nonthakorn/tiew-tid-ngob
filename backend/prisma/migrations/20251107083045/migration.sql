/*
  Warnings:

  - You are about to drop the `PlaceCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PlaceToPlaceCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlaceToPlaceCategory" DROP CONSTRAINT "_PlaceToPlaceCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToPlaceCategory" DROP CONSTRAINT "_PlaceToPlaceCategory_B_fkey";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ALTER COLUMN "googlePlaceId" DROP NOT NULL;

-- DropTable
DROP TABLE "PlaceCategory";

-- DropTable
DROP TABLE "_PlaceToPlaceCategory";
