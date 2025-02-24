import styled from "styled-components";

import { colors } from "@/styles/colors";
import { Body1Medium, Body2Regular } from "@/styles/typography";

export const RouteMarkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.gray20};
  width: 100%;
`;

export const HeaderText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Departure = styled(Body1Medium)`
  color: ${colors.gray100};
`;

export const Arrival = styled(Body1Medium)`
  color: ${colors.gray100};
`;

export const ArrowRightIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "→";
    color: ${colors.gray70};
  }
`;

export const BusTicketInfo = styled(Body2Regular)`
  color: ${colors.gray70};
`;
export const LocationBtnWrapper = styled.div<{ $screenHeight: number }>`
  position: absolute;
  right: 10px;
  top: ${(props) => `${props.$screenHeight - 292 - 50}px`};
`;

export const BusSelectSection = styled.div`
  position: absolute;
  z-index: 1;
  left: 0px;
  right: 0px;
  bottom: 0px;
  text-align: right;
`;
