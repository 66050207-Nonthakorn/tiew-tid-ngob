import { LatLng } from "./plan";

export interface GooglePlace {
  id: string,
  formattedAddress: string,
  location: LatLng,
  displayName: { text: string }
  photos: GooglePlacePhoto[]
}

export interface GooglePlacePhoto {
  name: string,
  widthPx: number,
  heightPx: number,
  flagContentUri: string,
  googleMapsUri: string
}