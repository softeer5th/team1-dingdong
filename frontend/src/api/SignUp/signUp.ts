import { axiosInstance } from "@/api";

interface HomeLocation {
  houseRoadNameAddress: string;
  houseLatitude: number;
  houseLongitude: number;
}

export interface SignUpRequestType {
  name: string;
  email: string;
  password: string;
  home: HomeLocation;
  schoolId: number;
}

// export async function postSendUserSchoolEmail(email: string) {
//   try {
//     return axiosInstance.post("/api/home", {
//       email,
//     });
//   } catch (err: any) {
//     console.error("이메일 전송 요청 실패:", err);
//     throw new Error(err);
//   }
// }

// export async function postUserVerificationCode(code: string) {
//   try {
//     return axiosInstance.post("/api/home", {
//       code,
//     });
//   } catch (err: any) {
//     console.error("유저가 받은 인증 코드 전송 실패:", err);
//     throw new Error(err);
//   }
// }

export async function postUserInfo(userInfo: SignUpRequestType) {
  try {
    return axiosInstance.post("/api/auth/signup", userInfo);
  } catch (err: any) {
    console.error("회원가입 실패:", err);
    throw new Error(err);
  }
}

export async function postCheckDuplicateEmail(email: string) {
  try {
    return axiosInstance.post("/api/auth/check-email", {
      email: email,
    });
  } catch (err: any) {
    console.error("이메일 중복 체크 요청 실패:", err);
    throw new Error(err);
  }
}
