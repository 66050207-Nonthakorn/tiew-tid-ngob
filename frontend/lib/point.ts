import { LatLng } from "react-native-maps";

export function calculateMidpoint(point1: LatLng, point2: LatLng): LatLng {
  const lat = (point1.latitude + point2.latitude) / 2;
  const lng = (point1.longitude + point2.longitude) / 2;
  
  return {
    latitude: lat,
    longitude: lng
  };
}