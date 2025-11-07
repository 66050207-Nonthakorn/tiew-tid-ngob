import { Place } from "@/types/place";
import { LatLng } from "react-native-maps";

export async function fetchNearbyPlaces(midpoint: LatLng, radius: number = 1000): Promise<Place[]> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${midpoint.latitude},${midpoint.longitude}&` +
      `radius=${radius}&` +
      `type=tourist_attraction|restaurant|museum|park&` +
      `key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    if (data.status === "OK") {
      return data.results;
    }
    return [];
  }
  catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
}