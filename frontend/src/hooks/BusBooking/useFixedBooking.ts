import {
  getBusTimeScheduleArray,
  getBusPath,
  getAvailableBusInfoArray,
} from "@/api/BusBooking/fixedBusBooking";

import { useQuery } from "@tanstack/react-query";

export const useGetBusTimeSchedule = (direction: string) => {
  const { data } = useQuery({
    queryKey: ["busTimeSchedule", direction],
    queryFn: () => getBusTimeScheduleArray(direction),
  });
  return { data };
};

export const useGetAvailableBusInfo = (direction: string, time: string) => {
  const { data } = useQuery({
    queryKey: ["availableBusInfo", direction, time],
    queryFn: () => getAvailableBusInfoArray(direction, time),
  });
  return { data };
};

export const useGetBusPath = (busScheduleId: number) => {
  const data = useQuery({
    queryKey: ["busPath", busScheduleId],
    queryFn: () => getBusPath(busScheduleId),
  });

  return {
    data,
    isBusPathLoading: data.isLoading,
  };
};
