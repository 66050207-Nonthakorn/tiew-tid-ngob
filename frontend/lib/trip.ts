import { useAuthStore } from "@/store/auth";
import { Plan } from "@/types/plan";

export async function fetchTrips() {
  useAuthStore.getState().refreshAccessToken();
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return null;

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_PATH}/plan/history`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
  });

  const data = await res.json();
  return data.trips;
}

export async function saveTrip(plan: Plan, checkpoints: number[]) {
  useAuthStore.getState().refreshAccessToken();
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return null;

  const body = {
    totalPrice: 0,
    startAt: new Date(checkpoints[0]).toISOString(),
    endAt: new Date(checkpoints[checkpoints.length-1]).toISOString(),
    places: [] as any[]
  };

  for (const leg of plan.legs) {
    const transitSteps = leg.steps?.filter(step => step.travelMode === "TRANSIT") ?? [];
    body.totalPrice += transitSteps.length * 20;
  }

  for (let i = 0; i < plan.placeNames.length; i++) {
    const startLocation = i === 0 
      ? plan.legs[0].startLocation 
      : plan.legs[i-1]?.endLocation;

    body.places.push({
      name: plan.placeNames[i].text,
      googlePlaceId: plan.placeNames[i].text,
      startAt: new Date(checkpoints[i]).toISOString(),
      endAt: new Date(checkpoints[i + 1]).toISOString(),
      price: 0,
      latitude: startLocation?.latLng?.latitude ?? 0,
      longitude: startLocation?.latLng?.longitude ?? 0
    });
  }

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_PATH}/plan/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  return data;
}