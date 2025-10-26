import z from "zod";

export const zRefreshTokenBody = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenBody = z.infer<typeof zRefreshTokenBody>;
