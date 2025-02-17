export function getTravelDuration(departureTime: string, arrivalTime: string) {
    let depTime = new Date(departureTime);
    let arrTime = new Date(arrivalTime);

    let diffMs = arrTime.getTime() - depTime.getTime(); // 밀리초 단위 차이 계산
    let diffMinutes = Math.floor(diffMs / (1000 * 60)); // 분 단위 변환

    let hours = Math.floor(diffMinutes / 60);
    let minutes = diffMinutes % 60;

    return `${hours ? `${hours}시간 ` : ''}${minutes ? `${minutes}분` : ''}`.trim();
}