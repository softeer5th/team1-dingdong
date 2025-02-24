import { CommuteType } from "@/pages/BusBooking/types/commuteType";
import { parseTime } from "./calendarUtils";
import { selectedDateType } from "@/pages/BusBooking/CustomRouteBooking/types/selectedDateType";

interface TimeInput {
  initHour: number;
  initMinute: number;
}

interface ScrollPosition {
  initAmPmScrollTop: number;
  initHourScrollTop: number;
  initMinuteScrollTop: number;
}
// 24시간제 -> 12시간제 변환 그리고 스크롤 위치에 맞게.
export const convertTimeToScrollPosition = ({
  initHour,
  initMinute,
}: TimeInput): ScrollPosition => {
  // AM/PM 결정 (0: AM, 1: PM)
  const initAmPmScrollTop = initHour >= 11 ? 1 : 0; // 인덱스 형식이라 11부터가 12시(오후)

  // 12시간제로 변환 (1-12)
  let hour12 = initHour % 12;
  if (hour12 === 0) hour12 = 12;

  // 시간을 인덱스로 변환 (1시=0, 2시=1,~ 12시=11)
  const initHourScrollTop = hour12;

  // 분을 인덱스로 변환 (0분=0, 30분=1)
  const initMinuteScrollTop = initMinute === 0 ? 0 : 1;

  return {
    initAmPmScrollTop,
    initHourScrollTop,
    initMinuteScrollTop,
  };
};

////// ------

interface BusOperatingHours {
  start: number;
  end: number;
}

interface TimeSlot {
  hour: number;
  minute: number;
}

interface BookingTimeResult {
  isAvailable: boolean;
  suggestedTime?: TimeSlot;
}

export const isBookingTimeAvailable = (
  selectedDate: Date,
  commuteType: CommuteType
): BookingTimeResult => {
  const now = new Date();

  const TWO_DAYS = 48 * 60 * 60; // in seconds

  // 버스 운영시간
  const busOperatingHours: Record<CommuteType, BusOperatingHours> = {
    등교: { start: 8, end: 18 },
    하교: { start: 11, end: 21 },
  };

  const operatingHours = busOperatingHours[commuteType];

  // 초기 최소 예약 가능 시간 (48시간 + 5분 후)
  let minDate = new Date(now.getTime() + TWO_DAYS * 1000);

  minDate.setHours(0, 0, 0, 0);

  // 초기 최대 예약 가능 시간 (48시간 후 + 2달)
  let maxDate = new Date(now.getTime() + TWO_DAYS * 1000);
  maxDate.setHours(0, 0, 0, 0);

  //  운영 시간 체크
  const currentHour = selectedDate.getHours();
  const currentMinutes = selectedDate.getMinutes();

  if (
    currentHour < operatingHours.start ||
    currentHour > operatingHours.end ||
    (currentHour === operatingHours.end && currentMinutes > 0)
  ) {
    return {
      isAvailable: false,
      suggestedTime: {
        hour: operatingHours.start,
        minute: 0,
      },
    };
  }

  // 모든 조건을 통과하면 true 반환
  return { isAvailable: true };
};

// 계산에 편하도록 24시간제로 변경
export const parseAndCreateTime = (
  selectedDate: selectedDateType,
  amPm: string,
  hour: string,
  minute: string
) => {
  const { hour: parsedHour, minute: parsedMinute } = parseTime({
    amPm,
    hour,
    minute,
  });
  return new Date(
    selectedDate.year,
    selectedDate.month - 1,
    selectedDate.day,
    parsedHour,
    parsedMinute
  );
};

export const handleTimeAvailability = (
  newTime: Date,
  commuteType: CommuteType
) => {
  // const availableTimeOrBoolean = isBookingTimeAvailable(newTime, commuteType);

  const result = isBookingTimeAvailable(newTime, commuteType);
  if (result.isAvailable) {
    // 해당 시간대로 그대로 진행
    return null;
  } else {
    const { hour, minute } = result.suggestedTime!;
    // result.suggestedTime을 사용하여 가능한 시간대로 제안
    // 예약 가능 첫날 또는 마지막날 시간 범위를 벗어나면 가장 가까운 시간대로, 운영시간을 벗어나면 가장 빠른 시간대로
    const morningOrNoon = hour >= 12 ? 1 : 0; // 오후면 1, 오전이면 0
    return { reset: true, hour, minute, morningOrNoon };
  }

  // if (typeof availableTimeOrBoolean === "boolean") {
  //   return !availableTimeOrBoolean
  //     ? { reset: true, hour: commuteType === "등교" ? 8 : 11 }
  //     : null;
  // } else {
  //   const morningOrNoon = availableTimeOrBoolean >= 12 ? 1 : 0;
  //   return { reset: true, hour: availableTimeOrBoolean, morningOrNoon };
  // }
};

export const updateScrollPosition = (
  reset: boolean,
  morningOrNoon: number,
  hour: number,
  minute: number,
  timeWheelRef: React.RefObject<any>
) => {
  if (reset) {
    // 오전 또는 오후, 시간, 00시로 셋팅.
    timeWheelRef.current?.resetScrollPosition(morningOrNoon, hour, minute);
  }
};
