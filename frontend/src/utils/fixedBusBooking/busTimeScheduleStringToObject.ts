interface TimeObj {
  hour: number;
  minute: number;
}
// key는 {year, month, day}를 문자열로 변환한 값
export interface BusTimeScheduleObject {
  [key: string]: TimeObj[];
}
//ex
// { "{year,month,day}": [{hour: 9, minute: 0}, {hour: 12, minute: 30}], ,,,

export const transformSchedules = (schedules: string[]) => {
  return schedules.reduce((acc: BusTimeScheduleObject, isoString) => {
    const date = new Date(isoString);

    // 날짜 키 생성
    const dateKey = {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // getMonth()는 0부터 시작하므로 1을 더함
      day: date.getDate(),
    };

    // 시간 객체 생성
    const timeObj = {
      hour: date.getHours(),
      minute: date.getMinutes(),
    };

    // dateKey를 문자열로 변환하여 사용 (객체 키로 사용하기 위해)
    const keyString = JSON.stringify(dateKey) as string;

    // 해당 날짜의 배열이 없으면 생성
    if (!acc[keyString]) {
      acc[keyString] = [];
    }

    // 시간 정보 추가
    acc[keyString].push(timeObj);

    return acc;
  }, {});
};
