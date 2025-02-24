import {
  getHomeLocationAndStation,
  updateStationLocationAndNickname,
} from "@/api/setHomeLocation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface StationLocationInfo {
  latitude: number;
  longitude: number;
  stationName: string;
  stationRoadAddressName: string;
}

export const useGetHomeLocation = () => {
  const { data } = useQuery({
    queryKey: ["stationInfo"],
    queryFn: getHomeLocationAndStation,
  });

  return {
    data,
  };
};

export const usePutStationLocation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: putHomeLocationMutation } = useMutation({
    mutationFn: (data: StationLocationInfo) => {
      return updateStationLocationAndNickname(data);
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["/api/users/home/locations"],
      });
    },
  });
  return { putHomeLocationMutation };
};
