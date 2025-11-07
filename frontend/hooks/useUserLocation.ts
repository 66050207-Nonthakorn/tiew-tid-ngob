import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getCurrentLocation() {
    setError(null);
    setIsLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation(location.coords);
    }
    catch {
      setError("Could not fetch location");
      return null;
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    userLocation,
    isLoading,
    error,
  };
}