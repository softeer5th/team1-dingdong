/*
type: 0 -> 글자 추가, 1 -> 01.02(수)
 */
export function getKstDay(isoString: string, type: number = 0) {
    let dateKst = new Date(isoString);
    let nowKst = new Date();


    let month = (dateKst.getMonth() + 1).toString().padStart(2, '0');
    let day = dateKst.getDate().toString().padStart(2, '0');
    let weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'short', timeZone: 'Asia/Seoul' }).format(dateKst);

    let isToday = dateKst.toDateString() === nowKst.toDateString();

    if (isToday) {
        return '오늘'
    }

    return type === 0 ? `${month}월 ${day}일 ${weekday}요일` :`${month}.${day}(${weekday})`
}
