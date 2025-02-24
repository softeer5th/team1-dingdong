import { WEEKDAYS } from "@/constants/calendarConstants";

export const ISOStringToDateDayFormat = (isoString: string): string => {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const dayOfWeek = WEEKDAYS[date.getDay()];

  return `${month}.${day}(${dayOfWeek}) ${hour}:${minute}`;
};
