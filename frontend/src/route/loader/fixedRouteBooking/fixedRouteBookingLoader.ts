// 예시: loader 함수 (fixedRouteBookingLoader.ts)

import { getAvailableBusInfoArray, getBusPath } from "@/api/BusBooking/fixedBusBooking";
import handleError from "../handleError";
import { users_home_locations, users_me } from "@/api/query/users";
import { queryClient } from "@/main";
import { bus_info_array_interface } from "@/api/query/fixedBusSelect";

export const fixedRouteBookingLoader = async () => {
  const [userMe, userHomeLocation] = await Promise.all([
    queryClient.ensureQueryData(users_me()),
    queryClient.ensureQueryData(users_home_locations()),
  ]);

  // sessionStorage에서 예약 정보 추출
  const { direction, timeSchedule } = JSON.parse(sessionStorage.getItem("/fixed-bus-booking") as string);

  // 첫 번째 GET 요청: 전체 버스 정보 가져오기
  try {
    const busInfoResponse = await getAvailableBusInfoArray(direction, timeSchedule);

    const busInfoArray: bus_info_array_interface[] = busInfoResponse.data?.result;
    // 예시로 첫 번째 버스의 busScheduleId 사용
    // 두 번째 GET 요청: 선택된 버스 경로 가져오기
    const busPathResponse = await getBusPath(busInfoArray[0].busScheduleId);

    const busPath = busPathResponse.points;

    return {
      userMe,
      userHomeLocation,
      busInfoArray,
      busPath,
      direction,
      timeSchedule,
    };
  } catch (e) {
    return handleError(e);
  }
};
