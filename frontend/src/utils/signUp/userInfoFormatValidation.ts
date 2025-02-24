export const isValidNameFormat = (text: string) => {
  const koreanRegex = /^[가-힣]{2,8}$/;
  return koreanRegex.test(text);
};

export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};
