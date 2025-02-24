

export function formatUtcToKst(utcTime: string): string {
    const date = new Date(utcTime);
    // 9시간을 더해 KST로 변환
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    // toISOString()은 기본적으로 'Z'를 붙이므로, 이를 '+09:00'으로 교체
    return kstDate.toISOString()
}
