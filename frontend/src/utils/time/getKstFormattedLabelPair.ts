export function getKstFormattedLabelPair(isoString: string) {
    let dateKst = new Date(isoString);
    let nowKst = new Date();

    let isToday = dateKst.toDateString() === nowKst.toDateString();

    if (isToday) {
        const hour = dateKst.getHours().toString().padStart(2, '0'); // 24시 형식
        const minute = dateKst.getMinutes().toString().padStart(2, '0');
        return [
            `오늘 ${hour}:${minute}`, // 배차 대기
            `` // 배차 확정
        ];
    } else {
        let month = (dateKst.getMonth() + 1).toString().padStart(2, '0');
        let day = dateKst.getDate().toString().padStart(2, '0');
        let weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'short', timeZone: 'Asia/Seoul' }).format(dateKst);
        const hour = dateKst.getHours().toString().padStart(2, '0'); // 24시 형식
        const minute = dateKst.getMinutes().toString().padStart(2, '0');
        return [
            `${month}.${day}(${weekday})`, // 배차 대기
            `${hour}:${minute}` // 배차 확정
        ];
    }
}
