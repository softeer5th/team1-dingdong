import styled from "styled-components";
import { colors } from "@/styles/colors"; // 색상 파일을 임포트해야 합니다.
import { Body1Medium, Body2Medium, Body2Regular } from "@/styles/typography";
import { fonts } from "@/styles/fonts";

export const ModalHeader = styled.div`
  display: flex;
  padding: 24px 20px 20px 20px;
  align-items: center;
  gap: 10px;
  color: ${colors.gray100};
  ${fonts.body1SemiBold};
`;

export const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;

  display: flex;

  padding: 8px 20px;

  color: ${colors.gray70};
  border-bottom: 1px solid ${colors.gray30};
`;

export const DateTitle = styled(Body2Regular)`
  color: ${colors.gray70};
`;
export const ArrivalTime = styled(Body2Regular)`
  color: ${colors.gray70};
`;

export const SelectTimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  flex-shrink: 0;
  margin-top: 6px;
`;

export const SelectTimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DateText = styled.div`
  color: ${colors.gray100};
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
`;

export const DayTime = styled(Body1Medium)`
  color: ${colors.orange900};
`;
export const TimeText = styled(Body1Medium)`
  color: ${colors.orange900};
`;

export const TimePickerWheel = styled.div``;

export const DateRepeatSelectBox = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 20px;
  align-items: center;
  align-self: stretch;
`;

export const DateRepeatText = styled(Body1Medium)`
  color: ${colors.gray70};
`;

export const CheckBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const DetailInfo = styled.div`
  display: flex;
  padding: 10px 20px;
  align-items: center;

  align-items: flex-start;
  gap: 4px;
`;

export const InfoText = styled(Body2Medium)`
  color: ${colors.gray70};
  margin-left: 4px;
`;

export const ButtonBox = styled.div`
  display: flex;

  padding: 20px;
  gap: 10px;
  margin-top: 14px;
`;
