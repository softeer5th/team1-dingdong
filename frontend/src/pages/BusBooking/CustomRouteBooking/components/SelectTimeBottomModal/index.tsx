import BottomOverlayModal from "@/pages/BusBooking/Components/BottomOverlayModal";
import { CommuteType } from "@/pages/BusBooking/types/commuteType";
import { useEffect, useMemo, useRef, useState } from "react";
import * as S from "./styles";
import CancelButton from "@/components/designSystem/Button/OutlineButton";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import InfoIcon from "@/components/designSystem/Icons/InfoIcon";
import { colors } from "@/styles/colors";
import DayRepeatBoxIcon from "@/components/designSystem/Icons/DayRepeatBoxIcon";
import DayRepeatCheckIcon from "@/components/designSystem/Icons/DayRepeatCheckIcon";

import TimeWheel, { TimeWheelHandle } from "@/components/TimePickerWheel";
import {
  TimeSchedule,
  TimeScheduleAction,
} from "@/pages/BusBooking/store/types";
import { formatDate, parseTime } from "@/utils/calendar/calendarUtils";
import { timeScheduleActions } from "@/pages/BusBooking/store/actions";

import { timeScheduleSelectors } from "@/pages/BusBooking/store/selectors";
import { allSameTimeOnSameWeekday } from "@/utils/calendar/selectTimeBottomModalUtils";
import { selectedDateType } from "../../types/selectedDateType";
import {
  handleTimeAvailability,
  parseAndCreateTime,
  updateScrollPosition,
} from "@/utils/calendar/timeWheelUtils";
import Modal from "@/components/Modal";
import { mountModal } from "@/components/Loading";
import { useDebounce } from "@/hooks/Debounce/useDebounce";

interface SelectTimeBottomModalProps {
  selectedDate: selectedDateType; // 모달에서 현재 선택된 시간
  selectedTimeSchedule: TimeSchedule; // 총 반영된 선택된 시간
  dispatch: React.Dispatch<TimeScheduleAction>; // 선택시, 업데이트에 사용할 dispatch
  commuteType: CommuteType;
  isTimeSelectModalOpen: boolean;
  setIsTimeSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SelectedTime {
  amPm: string;
  hour: string;
  minute: string;
}

const INIT_GO_SCHOOL_TIME = 7; // 오전 8시.
export default function SelectTimeBottomModal({
  selectedTimeSchedule,
  dispatch,
  selectedDate,
  commuteType,
  isTimeSelectModalOpen,
  setIsTimeSelectModalOpen,
}: SelectTimeBottomModalProps) {
  const [repeatIconToggle, setRepeatIconToggle] = useState<null | boolean>(
    null
  );

  const timeWheelRef = useRef<TimeWheelHandle>(null);

  const handleTimeChange = useDebounce(
    // 이벤트 발생한지 2초 간 움직임이 없다면 reset
    (amPm: string, hour: string, minute: string) => {
      const newTime = parseAndCreateTime(selectedDate, amPm, hour, minute);

      const timeAvailability = handleTimeAvailability(newTime, commuteType);
      if (timeAvailability) {
        updateScrollPosition(
          timeAvailability.reset,
          timeAvailability.morningOrNoon!,
          timeAvailability.hour - 1, // 스크롤 셋팅시 index방식이라 + 1
          timeAvailability.minute,
          timeWheelRef
        );
      }
    },
    2000
  );

  const checkIsAvailableTime = (selectedTime: SelectedTime) => {
    const newTime = parseAndCreateTime(
      selectedDate,
      selectedTime.amPm,
      selectedTime.hour,
      selectedTime.minute
    );
    const timeAvailability = handleTimeAvailability(newTime, commuteType);

    if (timeAvailability) {
      const { render, unmountModal } = mountModal();

      const { hour, minute, morningOrNoon } = timeAvailability;

      // 오전 hour: minute ~ 오후 6시나 9시. 버스 예매 가능 시간대를 선택해 주세요.
      const noonOrNot = morningOrNoon === 1 ? "오후" : "오전";
      const lastTime = commuteType === "등교" ? 6 : 9;
      const minMinute = minute <= 0 ? "" : `${minute}분`;
      const des = `${noonOrNot} ${
        hour > 12 ? hour - 12 : hour
      }시 ${minMinute} ~ 오후 ${lastTime}시 까지 가능해요`;
      render(
        <Modal
          title={[`버스 예약 시간을 조정해주세요.`]}
          text={[`${des}`]}
          isError={false}
          leftButton={{
            text: "확인",
            onClick: () => {
              render(<></>);
              unmountModal();
            },
          }}
        />
      );

      return false; // 불가능 시간.
    }
    return true;
  };
  const handleConfirm = () => {
    if (timeWheelRef.current) {
      const selectedTime = timeWheelRef.current.getSelectedTime();

      if (!checkIsAvailableTime(selectedTime)) {
        // 선택한 시간이 불가능한 시간대라면. 모달
        return;
      }

      dispatch(
        timeScheduleActions.setSingleTime({
          ...selectedDate,
          time: parseTime(selectedTime),
        })
      );
      if (repeatIconToggle) {
        dispatch(
          timeScheduleActions.setRepeatingDays({
            ...selectedDate,
            time: parseTime(selectedTime),
            commuteType,
          })
        );
      }
    }
  };

  const handleCancel = () => {
    dispatch(
      timeScheduleActions.removeSingleTime({
        ...selectedDate,
        month: selectedDate.month,
      })
    );
  };

  const getInitTime = useMemo(() => {
    if (
      timeScheduleSelectors.hasScheduledTime({
        timeSchedule: selectedTimeSchedule,
        ...selectedDate,
      })
    ) {
      const { hour, minute } = timeScheduleSelectors.getTimeForDate({
        timeSchedule: selectedTimeSchedule,
        ...selectedDate,
      });

      return { initHour: hour - 1, initMinute: minute }; // 저장된 값. 스크롤은 -1 해주고, 보여주는 데이터 값은 그대로 필수.
    }
    // 모달을 열었을 때, 초기값.

    const time24Hours = parseAndCreateTime(selectedDate, "오전", "8", "0");

    const initTimeResult = handleTimeAvailability(time24Hours, commuteType);
    if (!initTimeResult) {
      return { initHour: INIT_GO_SCHOOL_TIME, initMinute: 0 };
    }
    const { hour, minute } = initTimeResult!;
    return { initHour: hour - 1, initMinute: minute };
  }, [selectedTimeSchedule, selectedDate, commuteType]); // 의존성 배열에 필요한 값들 추가

  const isRepeatedDay = () => {
    let isRepeated = false;
    if (
      timeScheduleSelectors.hasScheduledTime({
        timeSchedule: selectedTimeSchedule,
        ...selectedDate,
      })
    ) {
      const { hour, minute } = timeScheduleSelectors.getTimeForDate({
        timeSchedule: selectedTimeSchedule,
        ...selectedDate,
      });
      isRepeated = allSameTimeOnSameWeekday({
        timeSchedule: selectedTimeSchedule,
        ...selectedDate,
        hour,
        minute,
      });
    }

    return isRepeated;
  };
  // hasdate이면 get해와서 표시.

  // 모달이 열릴 때, 토글 상태 다시 반영.
  useEffect(() => {
    if (isTimeSelectModalOpen && repeatIconToggle !== null) {
      const returnValue = isRepeatedDay();
      setRepeatIconToggle(returnValue);
    }
  }, [isTimeSelectModalOpen]);

  useEffect(() => {
    // 모달이 열리면 스크롤을 막음
    if (isTimeSelectModalOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isTimeSelectModalOpen]);

  return (
    <BottomOverlayModal
      isOpen={isTimeSelectModalOpen}
      onClose={() => {
        setIsTimeSelectModalOpen(false);
      }}
    >
      <S.ModalHeader>
        {commuteType === "등교"
          ? "도착 시각을 선택해주세요"
          : "출발 시각을 선택해주세요"}
      </S.ModalHeader>
      <S.SubHeader>
        <S.DateTitle>날짜</S.DateTitle>
        <S.ArrivalTime>
          {commuteType === "등교" ? "학교 도착 시각" : "집으로 출발 시각"}
        </S.ArrivalTime>
      </S.SubHeader>

      <S.SelectTimeInfo>
        <S.DateText>{formatDate(selectedDate)}</S.DateText>
        <S.SelectTimeBox>
          {timeScheduleSelectors.hasScheduledTime({
            timeSchedule: selectedTimeSchedule,
            ...selectedDate,
          }) ? (
            <>
              {/* hour, minute을 가지고 오전인지 오후인지 반환 &  */}
              <S.DayTime>
                {getInitTime.initHour >= 11 ? "오후" : "오전"}
              </S.DayTime>
              <S.TimeText>
                {getInitTime.initHour + 1 > 12
                  ? `${getInitTime.initHour + 1 - 12}:${getInitTime.initMinute
                      .toString()
                      .padStart(2, "0")}`
                  : `${getInitTime.initHour + 1}:${getInitTime.initMinute
                      .toString()
                      .padStart(2, "0")}`}
              </S.TimeText>
            </>
          ) : (
            <>-</>
          )}
        </S.SelectTimeBox>
      </S.SelectTimeInfo>
      <S.TimePickerWheel></S.TimePickerWheel>

      <TimeWheel
        ref={timeWheelRef}
        initTime={getInitTime}
        onTimeChange={handleTimeChange}
      />

      <S.DateRepeatSelectBox>
        <S.DateRepeatText>이 시각 요일 반복</S.DateRepeatText>

        <S.CheckBox
          onClick={() => {
            setRepeatIconToggle((prev) => !prev);
          }}
        >
          <DayRepeatBoxIcon
            fill={repeatIconToggle ? colors.orange900 : colors.gray40}
          />
          <DayRepeatCheckIcon />
        </S.CheckBox>
      </S.DateRepeatSelectBox>

      <S.DetailInfo>
        <InfoIcon />
        <S.InfoText>
          반복 요일에 시각이 자동 설정되지만,<br></br> 원하는 경우 일자를 선택해
          변경할 수 있어요.
        </S.InfoText>
      </S.DetailInfo>

      <S.ButtonBox>
        <CancelButton
          text="날짜 선택 해제"
          onClick={() => {
            setIsTimeSelectModalOpen(false);
            handleCancel();
          }}
        />
        <SolidButton
          text="선택하기"
          onClick={() => {
            setIsTimeSelectModalOpen(false);
            handleConfirm();
          }}
        />
      </S.ButtonBox>
    </BottomOverlayModal>
  );
}
