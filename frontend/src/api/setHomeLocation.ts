import { axiosInstance } from "@/api";
import { StationLocationInfo } from "@/hooks/setHomeLocation/useHomeLocation";
// 변동 예정.
// 주소 값과 별칭
export async function getHomeLocationAndStation() {
  try {
    const { data } = await axiosInstance.get("/api/users/home/locations");
    return data;
  } catch (err: any) {
    console.error("집 주소, 정류장 주소 get 실패", err);
    throw new Error(err);
  }
}

export async function updateStationLocationAndNickname(
  data: StationLocationInfo
) {
  try {
    return axiosInstance.put("/api/users/home", data);
  } catch (err: any) {
    console.error("집 주소 설정 변경 실패:", err);
    throw new Error(err);
  }
}
