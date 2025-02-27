import { WEEKDAYS } from "@/constants/calendarConstants";
import { CommuteType } from "@/pages/BusBooking/types/commuteType";

export const formatMonthName = (month: number) => {
  return `${month}월`;
};

export const formatDate = ({ year, month, day }: { year: number; month: number; day: number }): string => {
  const date = new Date(year, month, day); // JS에서 month는 0부터.
  const dayOfWeek = WEEKDAYS[date.getDay()];

  return `${month}월 ${day}일 ${dayOfWeek}`;
};
// 오후 2시 30분 => {hour:14, minute:30}
export const parseTime = ({ amPm, hour, minute }: { amPm: string; hour: string; minute: string }) => {
  let parsedHour = parseInt(hour, 10);
  const parsedMinute = parseInt(minute, 10);

  if (amPm === "오후" && parsedHour !== 12) {
    parsedHour += 12;
  } else if (amPm === "오전" && parsedHour === 12) {
    parsedHour = 0; // AM 12시는 0으로 변환
  }

  return { hour: parsedHour, minute: parsedMinute };
};
// 26일 외 xx개.
export const getSelectedDaysCount = (allSchedules: string[]): string => {
  const earliestDate = new Date(allSchedules[0]); // 가장 빠른 날짜

  return `${earliestDate.getDate()}일 외 ${allSchedules.length - 1}개`; // Day 값 반환
};

export const getDaysInMonth = (year: number, month: number) => {
  // 1월에서 이전 달로 가면 작년 12월로
  if (month < 0) {
    month = 11;
    year -= 1;
  } else if (month > 11) {
    year += 1;
    month = 0;
  }

  const daysInMonth = totalDaysInMonth(year, month);

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days: (number | "")[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push("");
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  new Array(42 - days.length).fill("").forEach((v) => days.push(v)); // 균일한 grid 크기를 위해 42개의 일 수를 계산.

  return days;
};

export const availableBookingMinDate = () => {
  const now = new Date();

  const TWO_DAYS_AND_FIVE_MINUTES_TO_SECONDS = 48 * 60 * 60;
  const minDate = new Date(now.getTime() + TWO_DAYS_AND_FIVE_MINUTES_TO_SECONDS * 1000);
  return minDate;
};
// 예매 가능한 기간에 해당하는지와 등교버스 하교버스 운영 시간이 지나도 비활성화여부를 체크.
export const isDateDisabled = (date: Date, commuteType: CommuteType, calendarType = "customBooking") => {
  void commuteType;
  if (calendarType !== "customBooking") {
    const now = new Date();
    const compareDate = new Date(date);
    compareDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    const TWO_DAYS = 48 * 60 * 60;
    const minDate = new Date(now.getTime());
    const maxDate = new Date(now.getTime() + TWO_DAYS * 1000);
    maxDate.setMonth(maxDate.getMonth() + 1); // 1개월 뒤까지.

    return compareDate < minDate || compareDate > maxDate;
  }

  const now = new Date();

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const minDate = new Date();
  minDate.setDate(now.getDate() + 2);

  const maxDate = new Date();
  maxDate.setDate(now.getDate() + 2);
  maxDate.setMonth(maxDate.getMonth() + 2);

  // 날짜만 비교하기 위한 복사본
  const compareDateDateOnly = new Date(date);
  // const minDateDateOnly = new Date(minDate);

  compareDateDateOnly.setHours(0, 0, 0, 0);
  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(0, 0, 0, 0);

  return compareDate < minDate || compareDate > maxDate;
};

// month은 실제 보다 -1 이므로 +1
export const totalDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};
