import styled from "styled-components";
import { colors } from "@/styles/colors.ts";

export const BusStopOverlayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(-50%);
`;

export const BusStopInfoBox = styled.div`
  display: flex;
  padding: 8px 12px 8px 8px;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 8px;
  background: ${colors.gray90};

  span {
    color: #fff;
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px; /* 150% */
  }
`;
