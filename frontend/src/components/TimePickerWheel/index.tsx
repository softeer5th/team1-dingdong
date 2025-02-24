import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Section, TimePickerContainer } from "./styles";
import TimePicker from "./TimePicker";
import { TIME_WHEEL_ITEM_BOX_HEIGHT } from "@/constants/timeWheelView";
import { convertTimeToScrollPosition } from "@/utils/calendar/timeWheelUtils";

interface TimeWheelDataType {
  // 24시간제.
  initHour: number;
  initMinute: number;
}
interface TimeWheelProps {
  initTime?: TimeWheelDataType; // 초기 설정 시간. ex) 14:00 형식
  onTimeChange?: (amPm: string, hour: string, minute: string) => void;
}
export interface TimeWheelHandle {
  getSelectedTime: () => { amPm: string; hour: string; minute: string };
  resetScrollPosition: (
    newAmPm: number,
    newHour: number,
    newMinute: number
  ) => void;
}

export default forwardRef(function TimeWheel(
  { initTime = { initHour: 8, initMinute: 0 }, onTimeChange }: TimeWheelProps,
  ref: React.ForwardedRef<TimeWheelHandle>
) {
  const initScrollTop = useRef(convertTimeToScrollPosition(initTime));

  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedAmPm, setSelectedAmPm] = useState("");

  // 특정 위치로 재설정하기 위한 상태
  const amPmContainerRef = useRef<HTMLDivElement | null>(null);
  const hourContainerRef = useRef<HTMLDivElement | null>(null);
  const minuteContainerRef = useRef<HTMLDivElement | null>(null);

  const hours = [...Array(12)].map((_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = ["00", "30"];
  const amPm = ["오전", "오후"];

  const extendedHours = [...hours, ...hours, ...hours];

  const midScrollPosition = hours.length * TIME_WHEEL_ITEM_BOX_HEIGHT; // 중앙에 위치하도록 설정

  const isStartTimeSet = useRef({
    isStartAmPmSet: true,
    isStartHourSet: true,
    isStartMinutesSet: true,
  }); // 초기 시간 값 설정을 위한 상태 값.

  useImperativeHandle(ref, () => ({
    getSelectedTime: () => ({
      amPm: selectedAmPm,
      hour: selectedHour,
      minute: selectedMinute,
    }),
    resetScrollPosition,
  }));

  // 특정 시각으로 스크롤을 재설정하는 함수.

  const resetScrollPosition = (
    newAmPm: number,
    newHour: number,
    newMinute: number
  ) => {
    if (amPmContainerRef.current) {
      amPmContainerRef.current.scrollTop = newAmPm * TIME_WHEEL_ITEM_BOX_HEIGHT;
    }

    if (hourContainerRef.current) {
      hourContainerRef.current.scrollTop = newHour * TIME_WHEEL_ITEM_BOX_HEIGHT;
    }

    if (minuteContainerRef.current) {
      minuteContainerRef.current.scrollTop =
        newMinute * TIME_WHEEL_ITEM_BOX_HEIGHT;
    }
  };

  const handleAmPmScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    if (isStartTimeSet.current.isStartAmPmSet) {
      // 초기는 임시적으로 8시.

      container.scrollTop =
        initScrollTop.current.initAmPmScrollTop * TIME_WHEEL_ITEM_BOX_HEIGHT;

      isStartTimeSet.current.isStartAmPmSet = false;
    }

    // 무한 스크롤 적용 조건 (항목이 3개 이상일 때)
    const index = Math.round(container.scrollTop / TIME_WHEEL_ITEM_BOX_HEIGHT);
    setSelectedAmPm(amPm[index] || "00");

    if (onTimeChange) {
      onTimeChange(selectedAmPm, selectedHour, selectedMinute);
    }
  };

  const smoothScrollAmPm = (targetIndex: number) => {
    if (amPmContainerRef.current) {
      const targetScrollTop = targetIndex * TIME_WHEEL_ITEM_BOX_HEIGHT;
      amPmContainerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
  };
// 오전, 오후 자동 바뀜 구현
  const currentAMPMIndex = useRef(initScrollTop.current.initHourScrollTop);// 오전또는 오후인지 나타내는 인덱스.
  const prevHourRef = useRef<number | null>(null); // 이전 시간을 저장할 ref

  const updateAmPmBasedOnHour = (hourNum: number) => {
    if (prevHourRef.current === null) {
      prevHourRef.current = hourNum; // 초기 값 설정
      return;
    }

    // 11 → 12 변화: AM -> PM
    if (prevHourRef.current === 10 && hourNum === 11) {
      currentAMPMIndex.current = currentAMPMIndex.current === 1 ? 0 : 1;
      smoothScrollAmPm(currentAMPMIndex.current);
    }

    // 12 → 11 변화: PM -> AM
    if (prevHourRef.current === 11 && hourNum === 10) {
      currentAMPMIndex.current = currentAMPMIndex.current === 1 ? 0 : 1;
      smoothScrollAmPm(currentAMPMIndex.current);
    }

    prevHourRef.current = hourNum; // 현재 시간을 이전 값으로 업데이트
  };

  const handleHourScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    // 무한 스크롤 적용 조건 (항목이 3개 이상일 때)
    if (hours.length > 2) {
      if (container.scrollTop <= TIME_WHEEL_ITEM_BOX_HEIGHT) {
        // 스크롤이 맨 위로 갔을 때 다시 중간 위치로.
        container.scrollTop = midScrollPosition;
      } else if (
        // 스크롤이 맨 아래로 갔을 때 다시 중간 위치로
        container.scrollTop >=
        TIME_WHEEL_ITEM_BOX_HEIGHT * (extendedHours.length - hours.length)
      ) {
        container.scrollTop = midScrollPosition;
      }
    }

    if (isStartTimeSet.current.isStartHourSet) {
      // 초기는 임시적으로 8시.
      container.scrollTop =
        initScrollTop.current.initHourScrollTop * TIME_WHEEL_ITEM_BOX_HEIGHT;

      isStartTimeSet.current.isStartHourSet = false;
    }

    const index =
      Math.round(container.scrollTop / TIME_WHEEL_ITEM_BOX_HEIGHT) %
      hours.length;

    setSelectedHour(hours[index]);

    //##
    updateAmPmBasedOnHour(index);

    if (onTimeChange) {
      onTimeChange(selectedAmPm, selectedHour, selectedMinute);
    }
  };

  const handleMinuteScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    if (isStartTimeSet.current.isStartMinutesSet) {
      // 초기는 임시적으로 8시.
      container.scrollTop =
        initScrollTop.current.initMinuteScrollTop * TIME_WHEEL_ITEM_BOX_HEIGHT;

      isStartTimeSet.current.isStartMinutesSet = false;
    }

    const index = Math.round(container.scrollTop / 46);
    setSelectedMinute(minutes[index]);

    if (onTimeChange) {
      onTimeChange(selectedAmPm, selectedHour, selectedMinute);
    }
  };

  useEffect(() => {
    convertTimeToScrollPosition(initTime);
  }, []);

  return (
    <Section>
      <TimePickerContainer>
        <TimePicker
          itemWidth={100}
          time={amPm}
          ref={amPmContainerRef}
          handleTimeScroll={handleAmPmScroll}
          selectedTime={selectedAmPm}
        />
        <TimePicker
          time={extendedHours}
          ref={hourContainerRef}
          handleTimeScroll={handleHourScroll}
          selectedTime={selectedHour}
        />
        <TimePicker
          time={minutes}
          ref={minuteContainerRef}
          handleTimeScroll={handleMinuteScroll}
          selectedTime={selectedMinute}
        />
      </TimePickerContainer>
    </Section>
  );
});
