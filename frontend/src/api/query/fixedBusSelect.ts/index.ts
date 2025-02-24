interface BusStop {
  name: string;
  time: string; // "2025-02-11'T'13:00:00" 형식의 문자열
  longitude: number;
  latitude: number;
}

interface BusInfo {
  name: string;
  reservedSeat: number;
  totalSeat: number;
}

export interface bus_info_array_interface {
  busScheduleId: number;
  busStopId: number;
  busStop: BusStop;
  busInfo: BusInfo;
}
