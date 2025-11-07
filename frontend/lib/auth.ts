import { fetch } from "expo/fetch";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';

type TokenResponse = {
  accessToken: string,
  refreshToken: string
  createdAt: string
}

GoogleSignin.configure({
  webClientId: "595523714235-qrhr006ggite94udfg3v7go4dami2rh1.apps.googleusercontent.com",
  iosClientId: "595523714235-f5ucapqkfaih3hqcnpi06jhiu7t9kjc1.apps.googleusercontent.com",
});

const serverUrl = process.env.EXPO_PUBLIC_API_PATH!;

export async function passwordSignUp(email: string, name: string, password: string): Promise<void> {
  const res = await fetch(`${serverUrl}/auth/password/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password })
  });

  if (!res.ok) {
    const data = await res.json() as { message: string };
    throw new Error(data.message);
  }
}

export async function passwordSignIn(emailOrName: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${serverUrl}/auth/password/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrName, password })
  });

  if (!res.ok) {
    const data = await res.json() as { message: string };
    throw new Error(data.message);
  }

  const data = await res.json() as TokenResponse;
  return data;
}

export async function googleSignIn(): Promise<TokenResponse> {
  await GoogleSignin.hasPlayServices();
  const googleRes = await GoogleSignin.signIn();

  if (!isSuccessResponse(googleRes)) {
    throw new Error("User aborted");
  }

  const res = await fetch(`${serverUrl}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken: googleRes.data.idToken
    })
  });


  if (!res.ok) {
    const data = await res.json() as { message: string };
    throw new Error(data.message);
  }

  const data = await res.json() as TokenResponse;
  return data;
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch(`${serverUrl}/auth/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  const data = await res.json() as { accessToken: string };
  return data.accessToken;
}