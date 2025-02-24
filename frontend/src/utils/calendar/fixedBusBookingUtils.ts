import {
  SelectedDateType,
  timeType,
} from "@/pages/BusBooking/FixedRouteBooking/page";

export const convertInfoToText = (
  selectedDate: SelectedDateType,
  selectedHourMinute: timeType
) => {
  const { year, month, day } = selectedDate;
  const { hour, minute } = selectedHourMinute!;

  // 날짜 객체 생성
  const date = new Date(year, month - 1, day, hour, minute);

  // 요일 변환 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const dayOfWeekArray = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = dayOfWeekArray[date.getDay()];

  // 두 자리 숫자로 변환 (01, 02 등)
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");
  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  return `${formattedMonth}.${formattedDay} (${dayOfWeek}) ${formattedHour}:${formattedMinute}`;
};
