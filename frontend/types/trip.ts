export interface Trip {
  totalPrice: number,
  startAt: string,
  endAt: string,
  rating: number,
  places: TripPlace[],
}

export interface TripPlace {
  googlePlaceId: string,
  startAt: string,
  endAt: string,
  price: number,
  latitude: number,
  longitude: number,
}