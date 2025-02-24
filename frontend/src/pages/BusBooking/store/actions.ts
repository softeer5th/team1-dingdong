import { CommuteType } from "../types/commuteType";
import { Time } from "./types";

interface TimePayload {
  year: number;
  month: number;
  day: number;
  time: Time;
}

interface RecommendationPayload {
  year: number;
  month: number;
  recommendations: string[];
}

interface RepeatingDaysPayload extends TimePayload {
  commuteType: CommuteType;
}

export const timeScheduleActions = {
  setSingleTime: ({ year, month, day, time }: TimePayload) => ({
    type: "SET_SINGLE_TIME" as const,
    payload: { year, month, day, time },
  }),

  removeSingleTime: ({ year, month, day }: Omit<TimePayload, "time">) => ({
    type: "REMOVE_SINGLE_TIME" as const,
    payload: { year, month, day },
  }),

  setTimeTableRecommendations: ({
    year,
    month,
    recommendations,
  }: RecommendationPayload) => ({
    type: "SET_TIMETABLE_RECOMMENDATIONS" as const,
    payload: { year, month, recommendations },
  }),

  clearTimeTableRecommendations: ({
    year,
    month,
  }: Omit<RecommendationPayload, "recommendations">) => ({
    type: "CLEAR_TIMETABLE_RECOMMENDATIONS" as const,
    payload: { year, month },
  }),

  setRepeatingDays: ({
    year,
    month,
    day,
    time,
    commuteType,
  }: RepeatingDaysPayload) => ({
    type: "SET_REPEATING_DAYS" as const,
    payload: { year, month, day, time, commuteType },
  }),

  clearAll: () => ({
    type: "CLEAR_ALL" as const,
  }),
};
