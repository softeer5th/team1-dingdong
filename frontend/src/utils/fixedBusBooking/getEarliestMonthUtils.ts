export const getEarliestMonth = (dates: string[]): number => {
  if (dates.length === 0) {
    return new Date().getMonth();
  }

  return new Date(Math.min(...dates.map((date) => new Date(date).getTime()))).getMonth();
};
