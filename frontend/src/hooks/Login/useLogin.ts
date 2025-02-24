import { postLogin } from "@/api/Login/login";

import { useMutation } from "@tanstack/react-query";

export interface LoginDataType {
  email: string;
  password: string;
}
export const useLogin = () => {
  const { mutateAsync: postLoginMutation } = useMutation({
    mutationFn: (loginFormData: LoginDataType) => {
      return postLogin(loginFormData);
    },
  });
  return { postLoginMutation };
};
