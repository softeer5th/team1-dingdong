export const convertToFormattedTime = (schedules: string[]): string[][] => {
  return schedules.map((schedule) => {
    const date = new Date(schedule);

    // 날짜 형식: "2월 26일"
    const day = date.getDate();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줘야함
    const formattedDate = `${month}월 ${day}일`;

    // 요일 형식: "수요일"
    const weekday = date.toLocaleString("ko-KR", { weekday: "long" });

    // 12시간제 시간 형식: "오전 11:00" / "오후 3:00"
    let hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? "오후" : "오전";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    const formattedTime = `${ampm} ${hour}:${minute < 10 ? "0" : ""}${minute}`;

    return [`${formattedDate} ${weekday}`, formattedTime];
  });
};

export const convertIsoToDateObject = (
  isoString: string
): { year: number; month: number; day: number } => {
  const date = new Date(isoString); // 한국식 ISO => Date 객체 생성
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return { year, month, day };
};
