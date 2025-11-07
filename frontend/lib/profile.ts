import { useAuthStore } from "@/store/auth";
import { Profile } from "@/types/user";
import { fetch } from "expo/fetch";

export async function fetchProfile() {
  useAuthStore.getState().refreshAccessToken();
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return null;

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_PATH}/user/profile`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
  });

  const data = await response.json();
  return data as Profile;
}