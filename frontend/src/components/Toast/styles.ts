import styled from "styled-components";
import { colors } from "@/styles/colors.ts";

export const ToastWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "translateY",
})<{ translateY: string }>`
  position: fixed;
  z-index: 1000;
  left: 50%;
  bottom: 0;
  transform: ${({ translateY }) => `translate(-50%, ${translateY})`};
  transition: transform 0.3s ease-in-out;
  border-radius: 8px;
  background: ${colors.gray90};
  padding: 10px 14px;

  /* Background Blur */
  backdrop-filter: blur(0.75px);

  width: calc(100% - 40px);

  @media (min-width: 440px) {
    width: calc(375px - 40px);
  }

  span {
    color: ${colors.gray0};
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 22.4px */
  }
`;
