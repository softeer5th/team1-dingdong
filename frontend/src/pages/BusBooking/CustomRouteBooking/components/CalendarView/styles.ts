import styled from "styled-components";
import { colors } from "@/styles/colors";
import { Detail1Regular, Heading2SemiBold } from "@/styles/typography";
import { fonts } from "@/styles/fonts";

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
  }
`;
export const CalendarHeader = styled.div`
  display: flex;
  padding-bottom: 11px;
  padding-top: 11px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

export const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CurrentMonth = styled(Heading2SemiBold)`
  color: ${colors.gray100};
`;

export const DateHeader = styled.div`
  display: flex;
  height: 20px;

  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  gap: 4.5px;
  color: ${colors.gray70};
`;

export const Weekday = styled(Detail1Regular)`
  color: ${colors.gray70};
  text-align: center;
  width: calc(100% / 7);
`;

interface DayButtonProps {
  isToday?: boolean;
  isSelected?: boolean;
  $isHighlighted?: boolean;
  disabled?: boolean;
  $width: number;
}

export const CalendarWrapper = styled.div`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 200px;
  overflow: hidden;
  position: relative;
`;

export const GridWrapper = styled.div<{ $monthIndex: number }>`
  display: flex;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${(props) => -props.$monthIndex * 100}%);

  min-height: 300px;
`;
export const GridContainer = styled.div<{ $visible: boolean }>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(7, 1fr);
  grid-row-gap: 7px;
  grid-column-gap: 4.5px;
  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
  min-height: 299px;
`;

export const DayButton = styled.button<DayButtonProps>`
  /* width: calc(100% - 40px - 27px / 7); */
  aspect-ratio: 1/1;
  width: ${({ $width }) => `${$width}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  position: relative;
  ${fonts.body1Medium};
  cursor: pointer;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  color: ${(props) =>
    props.$isHighlighted
      ? colors.orange900
      : props.disabled
      ? colors.gray40
      : colors.gray100};
  background-color: ${(props) =>
    props.$isHighlighted ? colors.orange50 : "transparent"};
`;

// tool tip
export const ToopTip = styled.div`
  color: ${colors.gray0};
  text-align: right;
  ${fonts.detail1Regular};
  display: flex;
  padding: 6px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: ${colors.gray100};
  border-radius: 4px;

  right: 5px;
  top: 55px;

  position: absolute;
  height: max-content;
  svg {
    position: absolute;
    top: -8px;
    right: 54px;
  }
`;
