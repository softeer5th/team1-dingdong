import styled, {css} from "styled-components";
import { colors } from "@/styles/colors.ts";

export const Wrapper = styled.header.withConfig({
    shouldForwardProp: (prop) => prop !== 'backgroundColor'
})<{backgroundColor: string}>`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  height: 60px;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  background: ${({backgroundColor}) => backgroundColor};
    transition: background-color 0.3s ease-in-out;
`;

export const NavList = styled.ul`
  display: flex;
`;

export const NavButton = styled.button.withConfig({
    shouldForwardProp: prop => prop !== 'isNotification'
})<{ isNotification?: boolean; }>`
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative; /* 가상 요소 위치 조정을 위해 필요 */

    ${({ isNotification = false }) =>
            isNotification &&
            css`
      &::after {
        content: "";
        position: absolute;
        top: 9px;
        right: 10px;
        width: 7px;
        height: 7px;
        background-color: ${colors.orange900};
        border-radius: 50%; /* 원형 */
      }
    `}
`;


export const Title = styled.h1`
  font-family: Happiness-Sans-Title, sans-serif;
  color: ${colors.gray50};
  font-size: 20px;
`;
