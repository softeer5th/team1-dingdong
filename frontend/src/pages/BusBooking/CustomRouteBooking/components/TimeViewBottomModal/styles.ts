import styled from "styled-components";
import { colors } from "@/styles/colors"; // 색상 파일을 임포트해야 합니다.
import { fonts } from "@/styles/fonts";

export const ModalHeader = styled.div`
  display: flex;
  padding: 24px 20px 20px 20px;
  align-items: center;
  gap: 10px;
  color: ${colors.gray100};
  ${fonts.body1SemiBold};
`;

export const SelectedCount = styled.div`
  color: ${colors.orange900};
`;

export const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;

  display: flex;

  padding-top: 8px;
  padding-bottom: 8px;

  color: ${colors.gray70};
  border-bottom: 1px solid ${colors.gray30};
`;

export const DateTitle = styled.p`
  color: ${colors.gray70};
  font: ${fonts.body2Regular};
`;
export const ArrivalTime = styled.p`
  color: ${colors.gray70};
  font: ${fonts.body1Regular};
`;

export const SelectedScheduleWrapper = styled.div`
  margin-top: 4px;
    display: flex
    flex-direction: column;
    gap: 10px;
    padding: 0px 20px 20px 20px;
`;

export const ScheduleBoxWrapper = styled.div<{ $maxHeight: string }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: ${(props) =>
    props.$maxHeight === "editable" ? "430px" : "320px"};
  overflow: scroll;
`;
export const ScheduleBox = styled.div`
  display: flex;
  padding: 4px 0px;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

export const DateInfo = styled.div`
  display: flex;
  align-items: center;

  color: ${colors.gray100};
  ${fonts.body1Medium};
`;

export const TimeInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const Time = styled.div`
  color: ${colors.gray100};
  font: ${fonts.body1Medium};
`;

export const EditIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
  }
`;
export const ButtonBox = styled.div`
  display: flex;
  padding: 20px;
  gap: 10px;
`;
