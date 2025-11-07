import { GooglePlace } from "@/type/place";
import { ClusterResponse, LatLng } from "@/type/plan";

export async function fetchNearbyPlaces(midpoint: LatLng, radius: number = 2000): Promise<GooglePlace[]> {
  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask": "places.displayName,places.id,places.formattedAddress,places.location"
      },
      body: JSON.stringify({
        includedTypes: ["tourist_attraction", "museum", "park"],
        locationRestriction: {
          circle: {
            center: midpoint,
            radius: radius
          }
        }
      })
    });
    
    const data = await response.json() as { places: GooglePlace[] };
    return data.places;
  }
  catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
}

export async function clusterLatLng(points: LatLng[]) {
  const response = await fetch(`${process.env.CLUSTER_SERVER_URL}/cluster`, {
    headers: { 
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      locations: points,
      n_clusters: 3
    })
  });

  const data = await response.json();
  return data as ClusterResponse;
}

export async function calculateRoute(points: LatLng[]) {
  if (points.length < 2) return null;

  const segments = [];
  const now = new Date();
  
  // Calculate routes between consecutive points
  for (let i = 0; i < points.length - 1; i++) {
    const origin = points[i];
    const destination = points[i + 1];
    
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      headers: {
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.latitude,
              longitude: origin.longitude
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.latitude,
              longitude: destination.longitude
            }
          }
        },
        travelMode: "TRANSIT",
        transitPreferences: {
          routingPreference: "LESS_WALKING"
        },
        departureTime: now.toISOString(),
        computeAlternativeRoutes: false,
        languageCode: "th",
      }),
    });

    const data = await response.json() as { routes?: { legs: any[] }[] };
    if (data.routes?.[0]) {
      segments.push(data.routes[0]);
    }
  }

  return {
    routes: [{
      legs: segments.map(route => route.legs[0])
    }]
  };
}