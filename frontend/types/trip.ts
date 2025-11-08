export interface Trip {
  totalPrice: number,
  startAt: string,
  endAt: string,
  rating: number | null,
  places: TripPlace[],
}

export interface TripPlace {
  startAt: string,
  endAt: string,
  price: number,
  place: Place
}

export interface Place {
  name: string,
  latitude: number,
  longitude: number,
  googlePlaceId: string
}