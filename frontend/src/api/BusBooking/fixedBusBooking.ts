import { axiosInstance } from "@/api";

export async function getBusTimeScheduleArray(direction: string) {
  try {
    const { data } = await axiosInstance.get(
      `/api/bus/schedule/time?direction=${direction}`
    );
    return { data };
  } catch (err: any) {
    console.error("함께 타기 예매 가능한 시간대 get 요청 실패", err);
    throw new Error(err);
  }
}

export async function getAvailableBusInfoArray(
  direction: string,
  time: string
) {
  try {
    const { data } = await axiosInstance.get(
      `/api/bus/available?direction=${direction}&time=${time}`
    );
    return { data };
  } catch (err: any) {
    console.error("함께 타기 버스 정류장 정보 get 실패", err);
    throw new Error(err);
  }
}

export async function getBusPath(busScheduleId: number) {
  try {
    const { data } = await axiosInstance.get(`/api/bus/path/${busScheduleId}`);
    return data;
  } catch (err: any) {
    console.error("해당 버스에 대한 경로 좌표 get 실패", err);
    throw new Error(err);
  }
}
