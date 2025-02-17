// 라이브러리
import { RouterProvider } from "react-router-dom";
// 전역 상태
import ResetStyle from "@/styles/ResetStyle.ts";
import GlobalStyle from "./styles/GlobalStyle.ts";
import { router } from "@/route";
import "@/webPushNotification/settingFCM.ts";
import { handleAllowNotification } from "./webPushNotification/handleAllowNotification.ts";
import { useEffect } from "react";

function App() {
  const notificationPermission = async () => {
    try {
      const notificationResult = await handleAllowNotification();
      // default : 사용자가 아직 해당 서비스에 대한 알림을 권한을 선택 안한 경우
      // default 일 때, 모달을 띄어서 허용 여부?
      if (notificationResult === "granted") {
        document.body.style.overflowY = "scroll"; // granted의 로딩 후에 실행
      }
    } finally {
    }
  };
  // 푸시알림 허용 창 띄우기 로직
  useEffect(() => {
    // if 로그인을 한 유저 일 때.
    notificationPermission();
  }, []);
  return (
    <>
      <ResetStyle />
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
