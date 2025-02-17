

export function formatKst(date: string) {
    return new Date(new Date(date).getTime() + 9 * 60 * 60 * 1000).toISOString()
}