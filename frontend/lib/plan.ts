import { useAuthStore } from "@/store/auth"
import { Plan } from "@/types/plan";
import { fetch } from "expo/fetch"
import { LatLng } from "react-native-maps";

export async function fetchPlan(price: number, point: LatLng) {
  useAuthStore.getState().refreshAccessToken();
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return null;

  const { latitude, longitude } = point;

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_PATH}/plan/generate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ price, latitude, longitude })
  });

  const data = await response.json() as { plans: Plan[] };
  return data.plans;
}