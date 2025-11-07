-- DropIndex
DROP INDEX "TripPlace_placeId_key";

-- DropIndex
DROP INDEX "TripPlace_tripId_key";

-- CreateIndex
CREATE INDEX "TripPlace_placeId_idx" ON "TripPlace"("placeId");
