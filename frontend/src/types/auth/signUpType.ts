interface HomeLocation {
  houseLatitude: number;
  houseLongitude: number;
  stationLatitude?: number;
  stationLongitude?: number;
  stationName?: string;
}

interface SchoolLocation {
  name: string;
  roadNameAddress: string;
  latitude: number;
  longitude: number;
}

export interface SignUpRequestType {
  name: string;
  email: string;
  password: string;
  home: HomeLocation;
  school: SchoolLocation;
} 