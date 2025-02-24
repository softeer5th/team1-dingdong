import {
  postCheckDuplicateEmail,
  postUserInfo,
  SignUpRequestType,
} from "@/api/SignUp/signUp";
import { useMutation } from "@tanstack/react-query";

export const usePostUserInfo = () => {
  const { mutateAsync: postUserInfoMutation } = useMutation({
    mutationFn: (userInfo: SignUpRequestType) => {
      return postUserInfo(userInfo);
    },
  });
  return { postUserInfoMutation };
};

export const usePostCheckDuplicateEmail = () => {
  const { mutateAsync: postPostCheckDuplicateEmailMutation } = useMutation({
    mutationFn: (email: string) => {
      return postCheckDuplicateEmail(email);
    },
  });
  return { postPostCheckDuplicateEmailMutation };
};
