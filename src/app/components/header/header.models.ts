export interface LocationCoords {
  lat: number;
  long: number;
}


export interface UserLocation {
  coords: LocationCoords;
  name: string;
  timestamp?: number;
}
