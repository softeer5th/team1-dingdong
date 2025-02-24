export function getTravelDuration(
    departureTime: string,
    arrivalTime: string,
    type: 0 | 1 = 0
) {
    let depTime = new Date(departureTime);
    let arrTime = new Date(arrivalTime);
    let curTime = new Date();

    let diffMs = arrTime.getTime() - depTime.getTime(); // 출발 ~ 도착 차이 (밀리초)
    let diffMinutes = Math.floor(diffMs / (1000 * 60)); // 분 단위 변환

    let hours = Math.floor(diffMinutes / 60);
    let minutes = diffMinutes % 60;

    // type === 0 -> 고정된 이동 시간 출력
    if (type === 0) {
        return `${hours ? `${hours}시간 ` : ""}${minutes ? `${minutes}분` : ""} 소요`.trim();
    }

    // type === 1 -> 현재 시간과 출발/도착 시간 비교
    let timeUntilDeparture = Math.floor((depTime.getTime() - curTime.getTime()) / (1000 * 60)); // 현재 ~ 출발 차이 (분)
    let timeUntilArrival = Math.floor((arrTime.getTime() - curTime.getTime()) / (1000 * 60)); // 현재 ~ 도착 차이 (분)

    if (timeUntilArrival <= 0) {
        return "이용 완료"; // 도착 시간이 현재보다 이전이면 "이용 완료"
    }

    if (timeUntilDeparture > 0) {
        // 출발 시간이 아직 남았음
        let depHours = Math.floor(timeUntilDeparture / 60);
        let depMinutes = timeUntilDeparture % 60;
        return `${depHours ? `${depHours}시간 ` : ""}${depMinutes ? `${depMinutes}분` : ""} 후 승차`.trim();
    }

    // 현재 시간이 출발 이후, 도착 이전 -> 이동 중
    let arrHours = Math.floor(timeUntilArrival / 60);
    let arrMinutes = timeUntilArrival % 60;
    return `${arrHours ? `${arrHours}시간 ` : ""}${arrMinutes ? `${arrMinutes}분` : ""} 후 하차`.trim();
}
