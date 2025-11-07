import z from "zod";

const zTripPlace = z.object({
  name: z.string(),
  googlePlaceId: z.string(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  price: z.number().int().positive(),
  latitude: z.number(),
  longitude: z.number(),
});

export const zCreateTripBody = z.object({
  totalPrice: z.number().int().positive(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  places: z.array(zTripPlace),
  rating: z.number().min(1).max(5).optional()
});

export type CreateTripBody = z.infer<typeof zCreateTripBody>;
export type TripPlace = z.infer<typeof zTripPlace>;