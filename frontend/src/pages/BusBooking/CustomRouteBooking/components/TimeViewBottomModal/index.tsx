import BottomOverlayModal from "@/pages/BusBooking/Components/BottomOverlayModal";
import {
  CommuteType,
  OverlayBottomModalType,
} from "@/pages/BusBooking/types/commuteType";

import * as S from "./styles";
import ChevronRightIcon from "@/components/designSystem/Icons/ChevronRightIcon";
import CancelButton from "@/components/designSystem/Button/OutlineButton";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import { useCustomNavigate } from "@/hooks/useNavigate";
import {
  convertIsoToDateObject,
  convertToFormattedTime,
} from "@/utils/calendar/timeViewBottomModalUtil";

import { selectedDateType } from "../../types/selectedDateType";
import { useEffect } from "react";

interface TimeViewBottomModalProps {
  setSelectedDate: React.Dispatch<React.SetStateAction<selectedDateType>>;
  setIsTimeSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  commuteType: CommuteType;
  isEditablTimeViewModalOpen: boolean;
  setIsEditablTimeViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: OverlayBottomModalType;
  selectedTimeSchduleArray: string[];
}

// const tempData = [
//   ["2월 26일 수요일", "11:00"],
//   ["2월 26일 수요일", "11:00"],
//   ["2월 26일 수요일", "11:00"],
//   ["2월 26일 수요일", "11:00"],
// ];
export default function TimeViewBottomModal({
  setSelectedDate,
  setIsTimeSelectModalOpen,
  commuteType,
  isEditablTimeViewModalOpen,
  setIsEditablTimeViewModalOpen,
  modalType,
  selectedTimeSchduleArray,
}: TimeViewBottomModalProps) {
  const navigateCustom = useCustomNavigate();
  const editIconHandler = (timeScheduleIndex: number) => {
    setSelectedDate(
      convertIsoToDateObject(selectedTimeSchduleArray[timeScheduleIndex])
    );
    setIsTimeSelectModalOpen(true); // 다시 선택 모달 켜기.
    setIsEditablTimeViewModalOpen(false);
    // 해당 시간에 해당하는 모달 open.
  };

  const paymentButtonHandler = () => {
    // 결제 페이지로 이동
    const direction = commuteType === "등교" ? "TO_SCHOOL" : "TO_HOME";
    // 올바른 사용 방식
    navigateCustom("/payment/reservation", {
      direction,
      timeSchedule: selectedTimeSchduleArray,
    });
    // 세션에 저장.
  };

  useEffect(() => {
    // 모달이 열리면 스크롤을 막음
    if (isEditablTimeViewModalOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditablTimeViewModalOpen]);

  return (
    <BottomOverlayModal
      isOpen={isEditablTimeViewModalOpen}
      onClose={() => {
        setIsEditablTimeViewModalOpen(false);
      }}
    >
      <S.ModalHeader>
        선택한 일정
        <S.SelectedCount>{selectedTimeSchduleArray.length}</S.SelectedCount>
      </S.ModalHeader>

      <S.SelectedScheduleWrapper>
        <S.SubHeader>
          <S.DateTitle>날짜</S.DateTitle>
          <S.ArrivalTime>
            {commuteType === "등교" ? "학교 도착 시각" : "집으로 출발 시각"}
          </S.ArrivalTime>
        </S.SubHeader>
        <S.ScheduleBoxWrapper $maxHeight={modalType}>
          {convertToFormattedTime(selectedTimeSchduleArray).map(
            ([dateInfo, time], timeScheduleIndex) => (
              <S.ScheduleBox key={dateInfo}>
                <S.DateInfo>{dateInfo}</S.DateInfo>
                <S.TimeInfo>
                  <S.Time>{time.toString().padStart(2, "0")}</S.Time>
                  {modalType === "editable" && (
                    <S.EditIconWrapper
                      onClick={() => editIconHandler(timeScheduleIndex)}
                    >
                      <ChevronRightIcon size={20} />
                    </S.EditIconWrapper>
                  )}
                </S.TimeInfo>
              </S.ScheduleBox>
            )
          )}
        </S.ScheduleBoxWrapper>
      </S.SelectedScheduleWrapper>

      {modalType === "lastStep" && (
        <S.ButtonBox>
          <CancelButton
            text="이전"
            onClick={() => setIsEditablTimeViewModalOpen(false)}
          />
          <SolidButton text="결제하기" onClick={paymentButtonHandler} />
        </S.ButtonBox>
      )}
    </BottomOverlayModal>
  );
}
