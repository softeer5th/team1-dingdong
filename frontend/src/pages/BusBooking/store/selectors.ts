import { TimeSchedule, Time } from "./types";

interface DateSelector {
  timeSchedule: TimeSchedule;
  year: number;
  month: number;
  day: number;
}

export const timeScheduleSelectors = {
  getTimeForDate: ({ timeSchedule, year, month, day }: DateSelector): Time => {
    return timeSchedule[year]?.[month]?.[day];
  },

  hasScheduledTime: ({
    timeSchedule,
    year,
    month,
    day,
  }: DateSelector): boolean => {
    return !!timeSchedule[year]?.[month]?.[day];
  },

  getMonthSchedule: ({
    timeSchedule,
    year,
    month,
  }: Omit<DateSelector, "day">) => {
    return timeSchedule[year]?.[month] || {};
  },

  getAllTimeScheduleToArray: (timeSchedule: TimeSchedule): string[] => {
    let allSchedules: string[] = [];

    // timeSchedule 객체를 순회하며 각 날짜에 대한 처리
    Object.keys(timeSchedule).forEach((yearStr) => {
      const year = parseInt(yearStr); // 문자열을 숫자로 변환
      Object.keys(timeSchedule[year]).forEach((monthStr) => {
        const month = parseInt(monthStr); // 문자열을 숫자로 변환
        Object.keys(timeSchedule[year][month]).forEach((dayStr) => {
          const day = parseInt(dayStr); // 문자열을 숫자로 변환

          // 해당 날짜의 시간이 있다면
          const { hour, minute } = timeSchedule[year][month][day];

          // 월, 일이 0-based index로 처리되므로 month는 -1 해줘야 함
          const date = new Date(year, month - 1, day, hour, minute);

          // 한국 시간(KST)으로 변환: UTC로부터 9시간을 더함
          date.setHours(date.getHours());

          // 한국 시간으로 변환된 ISO 형식 문자열을 배열에 추가
          allSchedules.push(date.toISOString());
        });
      });
    });

    allSchedules.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return allSchedules;
  },
};
