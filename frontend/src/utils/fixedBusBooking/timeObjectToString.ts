type DateObject = {
  year: number;
  month: number;
  day: number;
};

type TimeObject = {
  hour: number;
  minute: number;
};

export const convertToISOStringArray = (
  dateObj: DateObject,
  timeObj: TimeObject
): string[] => {
  const { year, month, day } = dateObj;
  const { hour, minute } = timeObj;

  // Date 객체는 월이 0부터 시작.
  const date = new Date(year, month - 1, day, hour, minute, 0);

  const ISOString = date.toISOString();

  const convertedToKST = new Date(ISOString); // UTC 기준 Date 객체 생성

  // 한국 시간(UTC+9)으로 조정
  convertedToKST.setHours(convertedToKST.getHours() + 9);

  // ISO 형식으로 변환
  const koreaISOString = convertedToKST.toISOString();

  const koreaTime = koreaISOString.replace(".000Z", "");

  return [koreaTime];
};
