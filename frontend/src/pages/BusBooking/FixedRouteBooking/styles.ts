import { colors } from "@/styles/colors";
import { Body1SemiBold } from "@/styles/typography";
import styled from "styled-components";

export const ShowSelectedSchedule = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 17px 20px;
  border-top: 1px solid #f3f3f6;
  padding-bottom: 100px;
`;
export const Subtitle = styled.div`
  color: ${colors.gray70};

  font-size: 16px;
  font-weight: 500;
  line-height: 150%; /* 24px */
`;

export const DescriptionText = styled(Body1SemiBold)<{ $color?: string }>`
  color: ${({ $color }) => ($color ? $color : colors.gray100)};
  display: flex;
  padding: 24px 20px 20px 20px;
  align-items: center;
  gap: 10px;
`;
export const Info = styled.div`
  color: ${colors.gray100};

  font-size: 16px;
  font-weight: 500;
  line-height: 150%; /* 24px */
`;

export const NextButtonContainer = styled.div`
  position: fixed;
  width: inherit;
  bottom: 0;
  background-color: white;
  display: flex;
  padding: 20px;
`;
