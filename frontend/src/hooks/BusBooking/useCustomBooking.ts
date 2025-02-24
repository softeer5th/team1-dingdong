import {
  getTimeTableRecommendationTime,
  TimeTableRecommendationQueryString,
} from "@/api/BusBooking/customBusBooking";

import { useQuery } from "@tanstack/react-query";

export const useGetTimeTableRecommendation = ({
  direction,
  yearMonth,
}: TimeTableRecommendationQueryString) => {
  const data = useQuery({
    queryKey: ["TimeTableRecommendation", yearMonth, direction],
    queryFn: () => getTimeTableRecommendationTime({ direction, yearMonth }),
  });

  return {
    data,
  };
};
