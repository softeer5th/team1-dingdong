import { SelectionWrapper, TimeSelectButton } from "./styles";
import { timeType } from "../../page";

interface TimeSelectButtonsProps {
  decidedSchedule: timeType[];
  selectedHourMinute: timeType | null;
  setSelectedHourMinute: React.Dispatch<React.SetStateAction<timeType | null>>;
}

export default function TimeSelectButtons({
  decidedSchedule,
  selectedHourMinute,
  setSelectedHourMinute,
}: TimeSelectButtonsProps) {
  return (
    <SelectionWrapper>
      {decidedSchedule.map(({ hour, minute }: timeType) => (
        <TimeSelectButton
          key={`${hour}:${minute}`}
          onClick={() => setSelectedHourMinute({ hour, minute })}
          $isHighlighted={
            hour === selectedHourMinute?.hour &&
            minute === selectedHourMinute.minute
          }
        >
          {hour}:{minute.toString().padStart(2, "0")}
        </TimeSelectButton>
      ))}
    </SelectionWrapper>
  );
}
