export function formatKstTime(isoString: string) {
    let dateKst = new Date(isoString);

    const hour = dateKst.getHours().toString().padStart(2, '0'); // 24시 형식
    const minute = dateKst.getMinutes().toString().padStart(2, '0');

    return `${hour}:${minute}`;
}