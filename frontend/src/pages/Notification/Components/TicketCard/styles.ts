import { colors } from "@/styles/colors";
import { Body1SemiBold, Body2SemiBold } from "@/styles/typography";
import styled from "styled-components";

export const EmptyCircle = styled.div<{
  $direction: "right" | "left";
  $isRead?: boolean;
  $cardType: string;
}>`
  position: absolute;

  border: 1px solid ${colors.gray30};
  top: ${({ $cardType }) =>
    $cardType === "ALLOCATION_FAILED" ? "146px" : "94px"};
  left: ${({ $direction }) => ($direction === "right" ? "20px" : "343px")};
  width: 12px;
  height: 24px;
  ${({ $direction }) =>
    $direction === "right" ? "border-left: none" : "border-right: none"};

  background-color: ${({ $isRead }) =>
    $isRead ? colors.white : colors.orange50};
  border-radius: ${({ $direction }) =>
    $direction === "right" ? "0 24px 24px 0" : "24px 0 0 24px"};
`;
export const CardContainer = styled.div`
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.gray30};
  background: #ffffff;
  overflow: hidden;
`;

export const Banner = styled(Body2SemiBold).attrs({ as: "div" })<{
  $cardType:
    | "ALLOCATION_SUCCESS"
    | "ALLOCATION_FAILED"
    | "BUS_START"
    | "WELCOME";
}>`
  background-color: ${({ $cardType }) =>
    $cardType === "ALLOCATION_SUCCESS" || "BUS_START"
      ? colors.orange100
      : colors.gray30};
  text-align: center;
  padding: 14px 0px;
  border-bottom: 1px solid ${colors.gray30};
  font-size: 14px;
  font-weight: 500;
  color: #4f4f4f;
  background-color: ${({ $cardType }) =>
    $cardType === "ALLOCATION_FAILED" && colors.gray30};
`;

export const HighlightText = styled(Body1SemiBold)`
  color: #ff7f27;
  font-weight: 600;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 38px;
`;

export const StationInfo = styled.div`
  text-align: center;
  flex: 1;
`;

export const StationName = styled.div`
  color: ${colors.gray100};
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const Time = styled.div`
  color: ${colors.gray100};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 21px */
`;

export const Arrow = styled.div`
  font-size: 18px;
  color: #bdbdbd;
`;
