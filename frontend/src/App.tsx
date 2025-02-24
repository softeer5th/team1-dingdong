// 전역 상태
import ResetStyle from "@/styles/ResetStyle.ts";
import GlobalStyle from "./styles/GlobalStyle.ts";
import "@/webPushNotification/settingFCM.ts";
import { lazy, Suspense } from "react";
import LoadingModal from "@/components/Loading";

// `RouterProvider` 자체를 동적 import
const LazyRouterProvider = lazy(async () => {
  const [{ RouterProvider }, { router }] = await Promise.all([
    import("react-router-dom"),
    import("@/route"),
  ]);
  return {
    default: () => <RouterProvider router={router} />,
  };
});

function App() {
  return (
    <>
      <ResetStyle />
      <GlobalStyle />
      <Suspense fallback={<LoadingModal text={"페이지 불러오는 중"} />}>
        <LazyRouterProvider />
      </Suspense>
    </>
  );
}

export default App;
