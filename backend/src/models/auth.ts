import z from "zod";

export const zUserSignUpBody = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string().min(8),
});

export const zUserSignInBody = z.object({
  emailOrName: z.string(),
  password: z.string().min(8),
});

export const zGoogleAuthBody = z.object({
  idToken: z.string()
});

export type PasswordSignInBody = z.infer<typeof zUserSignInBody>;
export type PasswordSignUpBody = z.infer<typeof zUserSignUpBody>;
export type GoogleAuthBody = z.infer<typeof zGoogleAuthBody>;