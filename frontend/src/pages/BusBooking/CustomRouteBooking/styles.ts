import styled from "styled-components";
import { fonts } from "@/styles/fonts";
import { colors } from "@/styles/colors";
export const Title = styled.div`
  display: flex;
  padding: 24px 20px 20px 20px;
  align-items: center;
  gap: 10px;
  ${fonts.body1SemiBold};
  color: ${colors.gray100};
`;
export const InfoTextBox = styled.div`
  display: flex;
  padding: 10px 20px;
  gap: 4px;
`;
export const DetailText = styled.p`
  ${fonts.body2Medium};
  color: ${colors.gray70};
`;

export const TotalEditableViewButton = styled.button`
  display: flex;
  padding: 20px;

  gap: 12px;
  align-self: stretch;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  border-top: 1px solid ${colors.gray30};
`;
export const ButtonTitle = styled.p`
  color: ${colors.gray70};
  ${fonts.body1Medium};
`;
export const CountViewBox = styled.div`
  display: flex;
`;

export const ScheduleCount = styled.p`
  color: ${colors.gray100};
  text-align: right;
  ${fonts.body1Medium};
`;

export const BottomContainer = styled.div`
  position: fixed;
  width: inherit;
  bottom: 0;
  background-color: white;
`;

export const ConfirmButtonWrapper = styled.div`
  padding: 20px;
  display: flex;
`;
