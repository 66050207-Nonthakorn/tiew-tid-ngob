import { Response, Request } from "express";
import prisma from "@/config/database";
import { Prisma } from "@/generated/prisma";
import { CreateTripBody } from "@/models/trip";
import { GeneratePlanBody } from "@/models/plan";
import { calculateRoute, clusterLatLng, fetchNearbyPlaces } from "@/lib/plan";

async function generatePlan(req: Request<{}, {}, GeneratePlanBody>, res: Response) {
  const { latitude, longitude } = req.body;
  
  try {
    const places = await fetchNearbyPlaces({ latitude, longitude });
    if (places.length === 0) {
      return res.status(404).json({ message: "There's no nearby place in your area" });    
    }
    
    const latLngs = places.map((place) => place.location);
    const { clusters } = await clusterLatLng(latLngs);
    
    const plans = Object.entries(clusters).map(([_, location]) => location)
    const planWithRoute = [];

    for (const plan of plans) {
      const points = plan.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude
      }));

      const computedRoute = await calculateRoute(points);
      planWithRoute.push((computedRoute as any).routes[0]);
    }

    return res.status(200).json({ plans: planWithRoute });
  }
  catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getTripHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        places: {
          include: {
            place: true
          }
        }
      },
      orderBy: { startAt: 'desc' }
    });

    return res.json({ trips });
  }
  catch (error) {
    console.error("Error fetching trip history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getTripHistoryFromId(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const trip = await prisma.trip.findFirst({
      where: { id, userId },
      include: {
        places: {
          include: {
            place: true
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.json({ trip });
  }
  catch (error) {
    console.error("Error fetching trip:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createTripHistory(req: Request<{}, {}, CreateTripBody>, res: Response) {
  try {
    const { totalPrice, startAt, endAt, places } = req.body;
    const userId = (req as any).user.id;
    
    const trip = await prisma.$transaction(async (tx) => {
      
      // Create the trip
      const newTrip = await tx.trip.create({
        data: {
          totalPrice,
          startAt: new Date(startAt),
          endAt: new Date(endAt),
          user: {
            connect: {
              id: userId
            }
          }
        }
      });

      // Create places and their categories
      for (const placeData of places) {
        // Create or find the place
        const place = await tx.place.upsert({
          where: {
            googlePlaceId: placeData.googlePlaceId
          },
          create: {
            googlePlaceId: placeData.googlePlaceId,
            latitude: placeData.latitude,
            longitude: placeData.longitude,
          },
          update: {
            googlePlaceId: placeData.googlePlaceId,
            latitude: placeData.latitude,
            longitude: placeData.longitude,
          }
        });

        // Create the trip-place relationship
        await tx.tripPlace.create({
          data: {
            tripId: newTrip.id,
            placeId: place.id,
            startAt: new Date(placeData.startAt),
            endAt: new Date(placeData.endAt),
            price: placeData.price
          }
        });
      }

      return newTrip;
    });

    return res.status(201).json({ trip });
  }
  catch (error) {
    console.error("Error creating trip:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  generatePlan,
  getTripHistory,
  getTripHistoryFromId,
  createTripHistory
};