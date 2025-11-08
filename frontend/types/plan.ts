import { Leg } from "./routes"

export interface Plan {
  placeNames: {
    languageCode: string,
    text: string
  }[],
  legs: Leg[]
}

export type PlanFilter 
  = "places:asc" | "places:desc" | "price:asc" | "price:desc" | "distance:asc" | "distance:desc";