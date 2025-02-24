import { colors } from "@/styles/colors";
import { Heading2SemiBold } from "@/styles/typography";
import styled from "styled-components";

export const Container = styled.div<{ $itemWidth: number }>`
  height: 140px;
  position: relative;
  width: ${(props) => `${props.$itemWidth}px`};
`;

export const SelectionBox = styled.div<{ $itemWidth: number }>`
  position: absolute;
  pointer-events: none;
  top: 47px;
  right: 0px;
  height: 46px;
  width: ${(props) => `${props.$itemWidth}px`};
  border-top: 1px solid ${colors.gray30};
  border-bottom: 1px solid ${colors.gray30};
`;

export const ScrollContainer = styled.div`
  height: 100%;
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: contain;
  padding: 60px 0;
`;

export const TimeItem = styled(Heading2SemiBold)<{ $isSelected: boolean }>`
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  color: ${(props) => (props.$isSelected ? colors.orange900 : colors.gray60)};
`;
