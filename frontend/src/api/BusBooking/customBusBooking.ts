import { axiosInstance } from "@/api";

export interface TimeTableRecommendationQueryString {
  direction: string;
  yearMonth: string;
}
export async function getTimeTableRecommendationTime({
  direction,
  yearMonth,
}: TimeTableRecommendationQueryString) {
  try {
    const { data } = await axiosInstance.get(
      `/api/users/reservations/suggestions?direction=${direction}&yearMonth=${yearMonth}`
    );
    return data;
  } catch (err: any) {
    console.error("시간표 추천 적용 GET 요청 실패:", err);
    throw new Error(err);
  }
}
