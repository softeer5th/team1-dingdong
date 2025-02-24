import { useState, ChangeEvent, useEffect, useRef } from "react";
import { PasswordGuidText, ValidGuideText } from "./styles";
import CustomInput from "../../Components/Input";
import CustomFormWrapper from "../../Components/FormWrapper";
import { NextButtonWrapper } from "../SchoolAuth/styles";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import { useLocation, useNavigate } from "react-router-dom";
import { SIGNUP_TEXT } from "@/constants/signupTexts";
import {
  isValidatePassword,
  validPasswordCriteria,
} from "@/utils/signUp/passwordValidation";
import { colors } from "@/styles/colors";

interface PasswordGuideTextType {
  passwordGuideText: string;
  color: string;
}
export default function PasswordSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = useRef();
  const userSchoolId = useRef();

  useEffect(() => {
    if (!location.state) {
      navigate("/signup");
      return;
    }
    userEmail.current = location.state.email;
    userSchoolId.current = location.state.selectdSchoolId;
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const [passwordGuideText, setPasswordGuideText] =
    useState<PasswordGuideTextType>({
      passwordGuideText: SIGNUP_TEXT.passwordGuideText,
      color: colors.gray50,
    });

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    if (password.length <= 0) {
      setPasswordGuideText({
        passwordGuideText: SIGNUP_TEXT.passwordGuideText,
        color: colors.gray50,
      });
      return;
    }
    if (isValidatePassword(password)) {
      setPasswordGuideText({
        passwordGuideText: SIGNUP_TEXT.passwordGuideText,
        color: colors.gray50,
      });
    } else
      setPasswordGuideText({
        passwordGuideText: SIGNUP_TEXT.passwordFormatWrongMaxLength,
        color: colors.red,
      });
  }, [password]);

  useEffect(() => {
    if (isValidatePassword(password) && password === confirmPassword) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }
  }, [password, confirmPassword]);

  const allCriteriaPassed = validPasswordCriteria.every(({ regex }) =>
    regex.test(password)
  );
  return (
    <>
      <CustomFormWrapper>
        <CustomInput
          hasError={!allCriteriaPassed}
          label="비밀번호"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="8자 이상의 비밀번호"
          maxLength={20}
        />
        <PasswordGuidText $textColor={colors.gray50}>
          {SIGNUP_TEXT.passwordGuideText}
        </PasswordGuidText>
        <div>
          {validPasswordCriteria.map(({ regex, text, id }) => {
            const isValid = regex.test(password);
            return (
              <PasswordGuidText key={id} $textColor={passwordGuideText.color}>
                {password.length > 20 && (
                  <>✖ 최대 20자까지만 입력 가능합니다.</>
                )}
                <ValidGuideText $isValid={isValid}>
                  {isValid ? "✅" : "❌"} {text}
                </ValidGuideText>
              </PasswordGuidText>
            );
          })}
        </div>

        <CustomInput
          label="비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="8자 이상의 비밀번호"
        />
      </CustomFormWrapper>

      <NextButtonWrapper>
        <SolidButton
          type="submit"
          active={buttonActive}
          text="다음"
          onClick={() =>
            navigate("/signup/user-info", {
              state: {
                email: userEmail.current,
                password,
                schoolId: userSchoolId.current,
              },
            })
          }
        />
      </NextButtonWrapper>
    </>
  );
}
