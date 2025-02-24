import { colors } from "@/styles/colors";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  0% {
    transform: translateY(100%); /* 화면 아래로 시작 */
    opacity: 0.5;
  }
  100% {
    transform: translateY(0); /* 제자리로 이동 */
    opacity: 1;
  }
`;

const slideDown = keyframes`
 0% {
  transform: translateY(0); 
    opacity: 1;
  }
  100% {
    transform: translateY(100%); 
    opacity: 0.5;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: flex-end; /* 아래쪽 정렬 */
  z-index: 1000;

  top: 0;
  left: 50%;
  transform: translateX(-50%);

  height: 100%;
  @media (min-width: 441px) {
    width: 375px; /* 화면 너비가 440px을 넘으면 375px로 고정 */
  }
`;

export const ModalContainer = styled.div<{
  isOpen: boolean;
  isClosing: boolean;
}>`
  width: 100%;
  background-color: ${colors.gray0};

  border-radius: 24px 24px 0px 0px;

  box-shadow: 0px -4px 8px 0px rgba(34, 34, 53, 0.04);

  animation: ${({ isClosing, isOpen }) =>
      isClosing ? slideDown : isOpen ? slideUp : "none"}
    0.3s ease-in-out;
  max-height: 752px;
  @media (min-width: 441px) {
    width: 375px; /* 화면 너비가 440px을 넘으면 375px로 고정 */
  }
`;
