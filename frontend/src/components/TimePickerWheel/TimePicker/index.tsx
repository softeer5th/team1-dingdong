import { forwardRef } from "react";
import { Container, ScrollContainer, SelectionBox, TimeItem } from "./styles";

interface TimePickerProps {
  time: string[]; // 배열
  handleTimeScroll: (e: React.UIEvent<HTMLDivElement>) => void; // 스크롤 이벤트 감지 핸들러.
  selectedTime: string; // 선택된 시간값
  itemWidth?: number;
}

// forwardRef 사용하여 ref 전달 가능하도록 수정
export default forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  { time, handleTimeScroll, selectedTime, itemWidth = 50 },
  ref
) {
  return (
    <Container $itemWidth={itemWidth}>
      <SelectionBox $itemWidth={itemWidth} />
      <ScrollContainer ref={ref} onScroll={handleTimeScroll}>
        {time.map((t, index) => (
          <TimeItem key={`t-${index}-${t}`} $isSelected={selectedTime === t}>
            {t}
          </TimeItem>
        ))}
      </ScrollContainer>
    </Container>
  );
});
