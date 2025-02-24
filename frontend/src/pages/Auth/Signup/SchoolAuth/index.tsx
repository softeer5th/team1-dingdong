import { useState, ChangeEvent, useEffect } from "react";
import {
  Label,
  EmailInputWrapper,
  EmailInput,
  VerificationTimeText,
  NextButtonWrapper,
  EmailFormWrapper,
  SchoolSelectWrapper,
} from "./styles";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import { Star } from "@/pages/SetHomeLocation/components/BottomModal/styles";

import { useLoaderData, useNavigate } from "react-router-dom";
import CustomFormWrapper from "../../Components/FormWrapper";

import { isValidEmailFormat } from "@/utils/login/emailValidation";
import Dropdown from "../../Components/Dropdown";

import { usePostCheckDuplicateEmail } from "@/hooks/SignUp/useSignUp";
import { useDebounce } from "@/hooks/Debounce/useDebounce";

export default function SchoolAuthSignUp() {
  const { schools: schoolList } = useLoaderData()[0];

  const [email, setEmail] = useState("");
  const { postPostCheckDuplicateEmailMutation } = usePostCheckDuplicateEmail();

  const [emailFormatHasError, setEmailFormatHasError] = useState(false);

  const [nextButtonActive, setNextButtonActive] = useState(false);

  const [verificationCodeErrorText, setVerificationCodeErrorText] =
    useState("");

  const [selectdSchoolId, setSelectedSchoolId] = useState<number>(0);

  const navigate = useNavigate();

  const [duplicateEmail, setDuplicateEmail] = useState(false);

  const debounceCheckEmail = useDebounce((email: string) => {
    postPostCheckDuplicateEmailMutation(email, {
      onSuccess: () => {
        setDuplicateEmail(false);
      },
      onError: () => {
        setDuplicateEmail(true);
      },
    });
  }, 500);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 몇 초에 한 번씩만 post 요청 보내서 중복 체크.
    if (isValidEmailFormat(e.target.value)) {
      debounceCheckEmail(e.target.value);
    }

    setEmail(e.target.value);
  };

  const checkVerificationCodeHandler = () => {
    setVerificationCodeErrorText("");

    navigate("password", {
      state: {
        email,
        selectdSchoolId,
      },
    });
  };
  useEffect(() => {
    if (isValidEmailFormat(email) && selectdSchoolId > 0 && !duplicateEmail) {
      setNextButtonActive(true);
    } else setNextButtonActive(false);
  }, [email, selectdSchoolId]);

  useEffect(() => {
    if (email.length === 0 || isValidEmailFormat(email)) {
      setEmailFormatHasError(false);
      return;
    }
    setEmailFormatHasError(true);
  }, [email]);

  return (
    <>
      <CustomFormWrapper>
        <EmailFormWrapper>
          <Label>
            이메일 <Star>*</Star>
          </Label>
          <EmailInputWrapper>
            <EmailInput
              $hasError={emailFormatHasError}
              value={email}
              onChange={handleEmailChange}
            />
          </EmailInputWrapper>
          {emailFormatHasError ? (
            <VerificationTimeText $hasError={emailFormatHasError}>
              올바른 이메일 형식이 아닙니다.
            </VerificationTimeText>
          ) : duplicateEmail ? (
            <VerificationTimeText $hasError={duplicateEmail}>
              중복된 이메일입니다.
            </VerificationTimeText>
          ) : (
            <></>
          )}
        </EmailFormWrapper>

        <SchoolSelectWrapper>
          <Label>
            학교를 선택해주세요<Star>*</Star>
          </Label>
          <Dropdown schoolList={schoolList} setSchoolId={setSelectedSchoolId} />
        </SchoolSelectWrapper>

        {/* 인증코드 에러. */}
        {verificationCodeErrorText.length > 0 && (
          <VerificationTimeText $hasError={emailFormatHasError}>
            {verificationCodeErrorText}
          </VerificationTimeText>
        )}
      </CustomFormWrapper>

      <NextButtonWrapper>
        <SolidButton
          type="submit"
          text="다음"
          onClick={checkVerificationCodeHandler}
          active={nextButtonActive}
        />
      </NextButtonWrapper>
    </>
  );
}
