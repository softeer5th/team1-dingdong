import PopHeader from "@/components/Headers/PopHeader";

import CustomFormWrapper from "../Components/FormWrapper";
import { NextButtonWrapper } from "../Signup/SchoolAuth/styles";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import { useNavigate } from "react-router-dom";
import CustomInput from "../Components/Input";
import { PageTitle, TitleName } from "./styles";
import { ChangeEvent, useEffect, useState } from "react";
import { isValidEmailFormat } from "@/utils/login/emailValidation";
import { colors } from "@/styles/colors";
import { useLogin } from "@/hooks/Login/useLogin";

import { AxiosError } from "axios";
import { mountModal } from "@/components/Loading";
import Modal from "@/components/Modal";
import { fcmTokenUtils } from "@/utils/fcmToken/fcmTokenStorage";
import { postDeviceToken } from "@/api/webPushNotification/notification";

const Login = () => {
  const navigate = useNavigate();
  const { postLoginMutation } = useLogin();

  const [email, setEmail] = useState("");
  const [emailFormatHasError, setEmailFormatHasError] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    if (email.length === 0 || isValidEmailFormat(email)) {
      setEmailFormatHasError(false);
      return;
    }
    setEmailFormatHasError(true);
  }, [email]);

  const renderLoginErrorModal = (errorMessage: string) => {
    const { render, unmountModal } = mountModal();
    render(
      <Modal
        title={["❗로그인 실패"]}
        text={[`${errorMessage}`]}
        leftButton={{ text: "확인", onClick: unmountModal }}
      />
    );
  };

  const loginHandler = () => {
    const { hasStoredToken } = fcmTokenUtils();
    const loginFormData = { email, password };
    postLoginMutation(loginFormData, {
      onSuccess: () => {
        navigate("/home");
        if (hasStoredToken()) {
          postDeviceToken();
        }
      },
      onError: (error: Error) => {
        const err = error as AxiosError<{ message: string }>;
        if (err.response) {
          renderLoginErrorModal(err.response.data.message);
        } else {
          console.log("Unknown error occurred");
        }
      },
    });
  };

  return (
    <>
      <PopHeader text="" />
      <PageTitle>
        <TitleName>로그인</TitleName>
      </PageTitle>
      <CustomFormWrapper>
        <CustomInput
          hasError={emailFormatHasError}
          label="이메일"
          value={email}
          onChange={handleEmailChange}
          placeholder="이메일을 입력해주세요"
        />
        {emailFormatHasError ? (
          <div style={{ color: colors.red, marginTop: "-20px" }}>
            올바른 이메일 형식이 아닙니다.
          </div>
        ) : (
          <div
            style={{
              color: "transparent",
              marginTop: "-20px",
            }}
          >
            올바른 이메일 형식이 아닙니다.
          </div>
        )}

        <CustomInput
          label="비밀번호"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력해주세요"
        />
      </CustomFormWrapper>

      <NextButtonWrapper>
        <SolidButton
          type="submit"
          text="로그인"
          active={
            !emailFormatHasError && password.length > 0 && email.length > 0
          }
          onClick={loginHandler}
        />
      </NextButtonWrapper>
    </>
  );
};

export default Login;
