import { CommuteType } from "../types/commuteType";

// src/store/types.ts

export interface Time {
  hour: number;
  minute: number;
}

export interface TimeSchedule {
  [year: number]: {
    [month: number]: {
      [day: number]: Time;
    };
  };
}

export type TimeScheduleAction =
  | {
      type: "SET_SINGLE_TIME";
      payload: {
        year: number;
        month: number;
        day: number;
        time: Time;
      };
    }
  | {
      type: "REMOVE_SINGLE_TIME";
      payload: {
        year: number;
        month: number;
        day: number;
      };
    }
  | {
      type: "SET_TIMETABLE_RECOMMENDATIONS";
      payload: {
        year: number;
        month: number;
        recommendations: string[]; // ISO 형식의 날짜 배열
      };
    }
  // 다른 액션들
  | {
      type: "CLEAR_TIMETABLE_RECOMMENDATIONS";
      payload: {
        year: number;
        month: number;
      };
    }
  // 다른 액션들
  | {
      type: "CLEAR_ALL";
    }
  | {
      type: "SET_REPEATING_DAYS";
      payload: {
        year: number;
        month: number;
        day: number;
        time: Time;
        commuteType: CommuteType;
      };
    };
