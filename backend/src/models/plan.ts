import z from "zod";

export const zGeneratePlanBody = z.object({
  price: z.number(),
  latitude: z.number(),
  longitude: z.number(),
});

export type GeneratePlanBody = z.infer<typeof zGeneratePlanBody>;
