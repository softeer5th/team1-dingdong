export const validPasswordCriteria = [
  { regex: /.{8,}/, text: "8자 이상 입력", id: "length" },
  { regex: /[a-z]/, text: "소문자 포함", id: "lowercase" },
  { regex: /[0-9]/, text: "숫자 포함", id: "number" },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "특수문자 포함", id: "special" },
];

export const passPasswordString = (valid: boolean) => {
  return valid ? "✔" : "✖";
};
export const isValidatePassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
  return regex.test(password);
};
