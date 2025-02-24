import { ChangeEvent, useEffect, useRef, useState } from "react";
import { NameGuideText } from "./styles";
import CustomFormWrapper from "../../Components/FormWrapper";
import CustomInput from "../../Components/Input";
import { NextButtonWrapper } from "../SchoolAuth/styles";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import { useLocation, useNavigate } from "react-router-dom";
import { SIGNUP_TEXT } from "@/constants/signupTexts";

import { useDaumPostcodePopup } from "react-daum-postcode";
import { SCRIPT_URLS } from "@/constants/daumPostCode";
import { isValidNameFormat } from "@/utils/signUp/userInfoFormatValidation";
import { usePostUserInfo } from "@/hooks/SignUp/useSignUp";
import {
  GeoLocationType,
  useGeoLocationAddress,
} from "../../hooks/useAddressToCoordinate";

import useKakaoLoader from "@/hooks/useKakaoLoader/useKakaoLoader";
import { AxiosError } from "axios";
import { mountModal } from "@/components/Loading";
import Modal from "@/components/Modal";
import { postDeviceToken } from "@/api/webPushNotification/notification";
import { fcmTokenUtils } from "@/utils/fcmToken/fcmTokenStorage";

// 예시 타입들

export default function UserInfoSignup() {
  // 브라우저 콘솔에서
  useKakaoLoader();

  const location = useLocation();

  const userInfoFromPreviousStep = useRef<{
    email: string;
    password: string;
    schoolId: number;
  }>({ email: "", password: "", schoolId: 1 });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    addressNickname: "우리집",
  });
  const [homeGeoLocation, setHomeGeoLocation] =
    useState<GeoLocationType | null>(null);

  useEffect(() => {
    if (!location.state) {
      navigate("/signup");
      return;
    }

    userInfoFromPreviousStep.current = location.state;
  }, []);

  const [nameFormatError, setNameFormatError] = useState(false);
  const { postUserInfoMutation } = usePostUserInfo();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const open = useDaumPostcodePopup(SCRIPT_URLS.daumPostCode);

  const handleComplete = (data: any) => {
    let fullAddress = data.roadAddress;

    setFormData((prev) => ({
      ...prev,
      ["address"]: fullAddress,
    }));
  };

  useGeoLocationAddress(formData.address, setHomeGeoLocation);

  const renderSignUpErrorModal = (errorMessage: string) => {
    const { render, unmountModal } = mountModal();
    render(
      <Modal
        title={["❗회원가입 실패"]}
        text={[`${errorMessage}`]}
        leftButton={{ text: "확인", onClick: unmountModal }}
      />
    );
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  useEffect(() => {
    setNameFormatError(!isValidNameFormat(formData.name));
  }, [formData.name]);

  const submitButtonActive =
    isValidNameFormat(formData.name) &&
    formData.address.length > 0 &&
    formData.addressNickname.length > 0;

  const submitUserInfoHandler = () => {
    if (!homeGeoLocation) return;
    const { hasStoredToken } = fcmTokenUtils();
    const splitAddress = formData.address.split(" ").slice(-2).join(" ");
    const finalUserInfo = {
      email: userInfoFromPreviousStep.current.email,
      password: userInfoFromPreviousStep.current.password,
      name: formData.name,
      home: {
        houseLatitude: homeGeoLocation.latitude,
        houseLongitude: homeGeoLocation.longitude,
        houseRoadNameAddress: splitAddress,
      },
      schoolId: userInfoFromPreviousStep.current.schoolId,
    };
    postUserInfoMutation(finalUserInfo, {
      onSuccess: async () => {
        navigate("/home");
        if (hasStoredToken()) {
          postDeviceToken();
        }
      },
      onError: (error: Error) => {
        const err = error as AxiosError<{ message: string }>;
        if (err.response) {
          renderSignUpErrorModal(err.response.data.message);
        } else {
          console.log("Unknown error occurred");
        }
      },
    });
  };
  return (
    <>
      <CustomFormWrapper>
        <CustomInput
          hasError={nameFormatError && formData.name.length > 0}
          name="name"
          label="이름"
          value={formData.name}
          onChange={handleChange}
          placeholder="이름을 입력해주세요"
          maxLength={8}
        />

        <NameGuideText $hasError={nameFormatError && formData.name.length > 0}>
          {SIGNUP_TEXT.nameGuideText}
        </NameGuideText>

        <CustomInput
          name="address"
          onClick={handleClick}
          label="주소"
          value={formData.address}
          onChange={handleChange}
          placeholder="클릭해서 주소를 선택해주세요"
          readonly={true}
        />
      </CustomFormWrapper>
      <NextButtonWrapper>
        <SolidButton
          type="submit"
          text="완료"
          onClick={submitUserInfoHandler}
          active={submitButtonActive}
        />
      </NextButtonWrapper>{" "}
    </>
  );
}
