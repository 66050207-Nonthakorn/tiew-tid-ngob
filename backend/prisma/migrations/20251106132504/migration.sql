/*
  Warnings:

  - You are about to drop the `PlaceTrip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlaceTrip" DROP CONSTRAINT "PlaceTrip_placeId_fkey";

-- DropForeignKey
ALTER TABLE "PlaceTrip" DROP CONSTRAINT "PlaceTrip_tripId_fkey";

-- DropTable
DROP TABLE "PlaceTrip";

-- CreateTable
CREATE TABLE "TripPlace" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "TripPlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripPlace_placeId_key" ON "TripPlace"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "TripPlace_tripId_key" ON "TripPlace"("tripId");

-- CreateIndex
CREATE INDEX "TripPlace_tripId_idx" ON "TripPlace"("tripId");

-- AddForeignKey
ALTER TABLE "TripPlace" ADD CONSTRAINT "TripPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlace" ADD CONSTRAINT "TripPlace_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
