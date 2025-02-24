const FCM_TOKEN_KEY = "fcm_token";

export const fcmTokenUtils = () => {
  // localStorage에 토큰을 저장하고 상태를 업데이트하는 함수
  const saveFCMTokenToStorage = (token: string) => {
    // 토큰 유효성 검사
    try {
      // localStorage에 토큰 저장
      localStorage.setItem(FCM_TOKEN_KEY, token);
      // React 상태 업데이트
      console.log("FCM token saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving FCM token:", error);
      return false;
    }
  };

  // 토큰 존재 여부 확인
  const hasStoredToken = () => {
    return !!localStorage.getItem(FCM_TOKEN_KEY);
  };

  // 토큰 가져오기
  const getFCMTokenFromStorage = () => {
    return localStorage.getItem(FCM_TOKEN_KEY);
  };

  // 토큰 삭제
  const clearFCMToken = () => {
    try {
      localStorage.removeItem(FCM_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing FCM token:", error);
      return false;
    }
  };

  return {
    saveFCMTokenToStorage,
    getFCMTokenFromStorage,
    clearFCMToken,
    hasStoredToken,
  };
};
