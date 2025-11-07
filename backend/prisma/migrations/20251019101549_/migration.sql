/*
  Warnings:

  - A unique constraint covering the columns `[googlePlaceId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PlaceCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Place_googlePlaceId_key" ON "Place"("googlePlaceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceCategory_name_key" ON "PlaceCategory"("name");

-- CreateIndex
CREATE INDEX "PlaceTrip_tripId_idx" ON "PlaceTrip"("tripId");

-- CreateIndex
CREATE INDEX "Trip_userId_idx" ON "Trip"("userId");
