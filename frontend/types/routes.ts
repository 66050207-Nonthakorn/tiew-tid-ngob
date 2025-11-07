// Generated types for the routes JSON (frontend/test.json)
// Copy/paste or import these where needed in the frontend codebase.

export interface RoutesResponse {
  routes: Route[];
}

export interface Route {
  legs: Leg[];
}

export interface Leg {
  distanceMeters?: number;
  duration?: string;
  staticDuration?: string;
  polyline?: Polyline;
  startLocation?: Location;
  endLocation?: Location;
  steps?: Step[];
  localizedValues?: LocalizedValues;
  stepsOverview?: StepsOverview;
  travelMode?: string;
}

export interface Polyline {
  encodedPolyline: string;
}

export interface Location {
  latLng: LatLng;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export type TravelMode = "TRANSIT" | "WALK" | "DRIVE" | "BICYCLE";

export interface Step {
  distanceMeters?: number;
  staticDuration?: string;
  duration?: string;
  polyline?: Polyline;
  startLocation?: Location;
  endLocation?: Location;
  navigationInstruction?: NavigationInstruction;
  localizedValues?: LocalizedValues;
  travelMode?: TravelMode;
  transitDetails?: TransitDetails;
}

export interface NavigationInstruction {
  maneuver?: string;
  instructions?: string;
}

export interface LocalizedValues {
  distance?: {
    text?: string;
  };
  duration?: {
    text?: string;
  };
  staticDuration?: {
    text?: string;
  };
}

export interface StepsOverview {
  multiModalSegments?: MultiModalSegment[];
}

export interface MultiModalSegment {
  stepStartIndex: number;
  stepEndIndex: number;
  navigationInstruction?: NavigationInstruction;
  travelMode?: string;
}

export interface TransitDetails {
  stopDetails?: StopDetails;
  localizedValues?: TransitLocalizedValues;
  headsign?: string;
  headway?: string;
  transitLine?: TransitLine;
  stopCount?: number;
}

export interface StopDetails {
  arrivalStop?: Stop;
  arrivalTime?: string;
  departureStop?: Stop;
  departureTime?: string;
}

export interface Stop {
  name?: string;
  location?: Location;
}

export interface TransitLocalizedValues {
  arrivalTime?: {
    time?: {
      text?: string;
    };
    timeZone?: string;
  };
  departureTime?: {
    time?: {
      text?: string;
    };
    timeZone?: string;
  };
}

export interface TransitLine {
  agencies?: Agency[];
  name?: string;
  color?: string;
  nameShort?: string;
  textColor?: string;
  vehicle?: Vehicle;
}

export interface Agency {
  name?: string;
  phoneNumber?: string;
  uri?: string;
}

export interface Vehicle {
  name?: {
    text?: string;
  };
  type?: string;
  iconUri?: string;
}
