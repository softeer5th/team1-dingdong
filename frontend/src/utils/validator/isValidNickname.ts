export const nicknameValidator = (nickname: string) => {
  // 특수문자나 이모티콘을 포함하지 않는지 검사하는 정규식
  const regex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]+$/;

  // nickname이 정규식과 일치하지 않으면 false반환.
  return regex.test(nickname);
};
