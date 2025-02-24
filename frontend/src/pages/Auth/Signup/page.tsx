import ExitHeader from "@/components/Headers/ExitHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { PageTitle, TitleName } from "./styles";

export default function SignupLayout() {
  const navigate = useNavigate();

  return (
    <>
      <ExitHeader text="" onClick={() => navigate("/")} />
      <PageTitle>
        <TitleName>회원가입</TitleName>
      </PageTitle>

      {/* 여기에 각 단계별 컴포넌트가 렌더링됨 */}
      <Outlet />
    </>
  );
}
