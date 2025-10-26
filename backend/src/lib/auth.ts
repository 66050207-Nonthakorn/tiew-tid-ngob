import jwt from "jsonwebtoken";

export function createJWT(payload: Record<string, string | number | undefined>) {
  const accessToken  = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!,  { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "4w" });

  return { accessToken, refreshToken };
}