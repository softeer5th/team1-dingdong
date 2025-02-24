import { getToken } from "firebase/messaging";
import { messaging } from "./settingFCM";

import { fcmTokenUtils } from "@/utils/fcmToken/fcmTokenStorage";
const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY;

export const handleAllowNotification = async () => {
  // 먼저 Notification API 지원 여부 체크
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    // 알림 설정을 아직 하지 않은 상태.
    const status = await Notification.requestPermission(); //granted, denied, default

    if (status === "denied") {
      return "denied";
    } else if (status === "granted") {
      try {
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
          console.log("해당 브라우저는 웹 푸시 알림을 지원하지 않습니다.");
          return;
        }
        // 서비스 워커 등록 완료를 기다림
        await registerServiceWorker();
        const token = await getDeviceToken(); // 최대 3번까지 재시도

        const { saveFCMTokenToStorage } = fcmTokenUtils();
        saveFCMTokenToStorage(token);

        return "granted";
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      return "default";
    }
  } else {
    return "exist Notification type";
  }
};

// getDeviceToken 재시도 로직 추가 => 디바이스 토큰 불러오기 실패를 대비
export const retryGetDeviceToken = async (retries: number): Promise<string> => {
  try {
    return await getDeviceToken();
  } catch (error) {
    if (retries === 0) {
      console.error("최대 재시도 횟수 초과:", error);
      throw error;
    } else {
      console.warn(`getDeviceToken 재시도 중... 남은 횟수: ${retries}`);
      return retryGetDeviceToken(retries - 1);
    }
  }
};

const getDeviceToken = async (): Promise<string> => {
  // 권한이 허용된 후에 토큰을 가져옴
  const token = await getToken(messaging!, {
    vapidKey: VAPID_KEY,
  });
  return token;
};

const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "firebase-messaging-sw.js"
    );
    console.log("Service Worker 등록 성공:", registration);
  } catch (error) {
    console.log("Service Worker 등록 실패:", error);
  }
};
