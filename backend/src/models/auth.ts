import z from "zod";

export const zUserAuthBody = z.object({
  email: z.email(),
  name: z.string().optional(),
  password: z.string().min(8),
});

export const zGoogleAuthBody = z.object({
  idToken: z.string()
});

export type UserAuthBody = z.infer<typeof zUserAuthBody>;
export type GoogleAuthBody = z.infer<typeof zGoogleAuthBody>;