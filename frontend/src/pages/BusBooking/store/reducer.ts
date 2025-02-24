import { produce } from "immer";
import { TimeSchedule, TimeScheduleAction } from "./types";
import { isDateDisabled } from "@/utils/calendar/calendarUtils";

export function timeScheduleReducer(
  state: TimeSchedule,
  action: TimeScheduleAction
): TimeSchedule {
  return produce(state, (draft) => {
    switch (action.type) {
      case "SET_SINGLE_TIME": {
        const { year, month, day, time } = action.payload;
        if (!draft[year]) draft[year] = {};
        if (!draft[year][month]) draft[year][month] = {};
        draft[year][month][day] = time;
        break;
      }

      case "REMOVE_SINGLE_TIME": {
        const { year, month, day } = action.payload;
        if (draft[year]?.[month]?.[day]) {
          delete draft[year][month][day];

          if (Object.keys(draft[year][month]).length === 0) {
            delete draft[year][month];
          }
          if (Object.keys(draft[year]).length === 0) {
            delete draft[year];
          }
        }
        break;
      }

      case "SET_TIMETABLE_RECOMMENDATIONS": {
        const { year, month, recommendations } = action.payload;
        if (!draft[year]) draft[year] = {};
        draft[year][month] = {};

        recommendations.forEach((isoDate) => {
          // ISO 형식의 날짜 => Date 객체로 변환
          const date = new Date(isoDate);

          // day, hour, minute 추출
          const day = date.getDate();
          const hour = date.getHours();
          const minute = date.getMinutes();

          const time = { hour, minute };

          draft[year][month][day] = time;
        });

        break;
      }

      case "CLEAR_TIMETABLE_RECOMMENDATIONS": {
        const { year, month } = action.payload;
        if (draft[year] && draft[year][month]) {
          delete draft[year][month];
        }
        if (Object.keys(draft[year]).length === 0) {
          delete draft[year];
        }
        break;
      }

      case "SET_REPEATING_DAYS": {
        // 요일 반복. 현재 월의 같은 요일은 같은 time으로 설정
        const { year, month, day, time, commuteType } = action.payload;

        const weekday = new Date(year, month - 1, day).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();

        if (!draft[year]) draft[year] = {};
        if (!draft[year][month]) draft[year][month] = {};

        for (let dayValue = 1; dayValue <= daysInMonth; dayValue++) {
          const currentDate = new Date(year, month - 1, dayValue);
          const availableDate = isDateDisabled(currentDate, commuteType);
          if (currentDate.getDay() === weekday && !availableDate) {
            draft[year][month][dayValue] = time;
          }
        }
        break;
      }

      case "CLEAR_ALL": {
        return {}; // 전체 데이터를 초기화
      }
    }
  });
}
