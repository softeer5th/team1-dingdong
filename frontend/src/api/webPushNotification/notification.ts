import { fcmTokenUtils } from "@/utils/fcmToken/fcmTokenStorage";
import { axiosInstance } from "..";

export const postDeviceToken = async () => {
  const { getFCMTokenFromStorage, clearFCMToken } = fcmTokenUtils();
  const token = getFCMTokenFromStorage(); // 저장해둔 토큰 가져오기

  if (token) {
    try {
      // 서버에 토큰 전송
      await axiosInstance.post("/api/users/fcm-token", {
        token,
      });
      clearFCMToken(); // 서버 저장 성공 후 로컬스토리지 토큰 제거
    } catch (error) {
      console.error("FCM 토큰 전송 실패:", error);
    }
  }
};
