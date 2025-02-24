import { LoginHome } from "./styles";
import Lottie from "react-lottie";
import animationData from "@/assets/lottie/busLoadingAnimation.json";
import { useNavigate } from "react-router-dom";
import DingdongLogoIcon from "@/components/designSystem/Icons/LoginHome/DingdongLogoIcon";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import { mountModal } from "@/components/Loading";
import Modal from "@/components/Modal";
import { useEffect } from "react";
import { handleAllowNotification } from "@/webPushNotification/handleAllowNotification";
import { isNotificationSupported } from "@/webPushNotification/settingFCM";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function LoginHomeScreen() {
  const navigate = useNavigate();

  const renderWebPushNotificationModal = () => {
    const { render, unmountModal } = mountModal();

    render(
      <Modal
        title={["🔔딩동 푸시 알림을 \n 허용해 주세요"]}
        text={[""]}
        leftButton={{
          text: "설정하기",
          onClick: () => {
            unmountModal();
            handleAllowNotification(); // 알림 처리 함수 실행
          },
        }}
      />
    );
  };

  const loginButtonHandler = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!isNotificationSupported) {
      return;
    }
    if (Notification.permission !== "granted") {
      renderWebPushNotificationModal();
      handleAllowNotification();
    }
  }, []);

  return (
    <LoginHome.Container>
      <LoginHome.Logo>
        <DingdongLogoIcon />
      </LoginHome.Logo>
      <LoginHome.SubTitle>딩동 한 번이면 캠퍼스까지 슝-</LoginHome.SubTitle>
      <LoginHome.IconWrapper>
        <Lottie width={140} height={105} options={defaultOptions} />
      </LoginHome.IconWrapper>
      <LoginHome.ButtonWrapper>
        <SolidButton onClick={loginButtonHandler} text={"로그인 하기"} />
        <LoginHome.SignUpButton onClick={() => navigate("/signup")}>
          이메일로 회원가입
        </LoginHome.SignUpButton>
      </LoginHome.ButtonWrapper>
      <LoginHome.FooterText>
        계속하면 DingDong의 이용약관에 동의하게 됩니다.
      </LoginHome.FooterText>
    </LoginHome.Container>
  );
}
