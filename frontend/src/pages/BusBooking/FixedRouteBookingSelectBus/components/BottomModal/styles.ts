import { colors } from "@/styles/colors";
import {
  Body1Medium,
  Body1SemiBold,
  Body2Medium,
  Detail1Medium,
  Heading1Bold,
} from "@/styles/typography";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  0% {
    transform: translateY(100%); /* 화면 아래로 시작 */
    opacity: 0.5;
  }
  100% {
    transform: translateY(0); /* 제자리로 이동 */
    opacity: 1;
  }
`;

// 밑 모달
export const BottomModal = styled.div<{ showBottomSheet: boolean }>`
  background-color: ${colors.white};

  display: ${(props) => (props.showBottomSheet ? "flex" : "none")};
  padding: 20px 20px 20px 20px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 24px 24px 0px 0px;
  box-shadow: 0px -4px 8px 0px rgba(34, 34, 53, 0.04);
  animation: ${slideUp} 0.3s ease-out;
  max-height: 80vh; // 최대 높이 설정
  overflow: hidden; // 내부 스크롤을 위해 필요
`;
export const BusCardTitle = styled.div`
  color: ${colors.gray70};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

export const Title = styled(Body1SemiBold).attrs({ as: "div" })`
  color: ${colors.gray100};
  margin-bottom: 20px;
`;

export const BusCardWrapper = styled.div`
  display: flex;
  overflow-x: auto; // scroll 대신 auto 사용
  scrollbar-width: none;
  margin-bottom: 20px;
  gap: 10px;
  width: 100%; // 전체 너비 사용
  -webkit-overflow-scrolling: touch; // iOS 스크롤 부드럽게

  &::-webkit-scrollbar {
    display: none; // 스크롤바 숨기기
  }
`;
export const BusSelectionCard = styled.div<{ $isSelected: boolean }>`
  cursor: pointer;
  display: flex;
  min-width: 200px; // width 대신 min-width 사용
  flex-shrink: 0; // 카드가 줄어들지 않도록 설정
  padding: 16px;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  border: 2px solid
    ${(props) => (props.$isSelected ? colors.blue100 : colors.gray30)};
  background: white;
  flex: 1;
`;

export const Time = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

export const TimeValue = styled(Heading1Bold)`
  color: ${colors.gray100};
`;

export const DepartOrArrival = styled(Body1Medium)`
  color: ${colors.gray100};
`;

export const LocationText = styled(Body1Medium)`
  color: ${colors.gray100};
  text-align: left;
`;

export const BusInfo = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

export const BusNo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const BusNumber = styled(Body2Medium)`
  color: ${colors.gray70};
`;

export const PeopleInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const RemainSeat = styled(Detail1Medium)`
  color: ${colors.orange900};
`;

export const TotalSeat = styled(Detail1Medium)`
  color: ${colors.gray70};
`;

export const BusSelectButtonStepWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
