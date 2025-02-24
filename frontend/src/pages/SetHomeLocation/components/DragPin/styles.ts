import { colors } from "@/styles/colors";
import { fonts } from "@/styles/fonts";
import styled from "styled-components";

export const PinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
`;

export const PinMark = styled.div`
  display: flex;
  width: 190px;
  height: 58px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;

  border-radius: 8px;
  background-color: ${colors.gray90};
`;

export const PinTitle = styled.div`
  color: ${colors.orange900};
  text-align: center;
  ${fonts.body2SemiBold}
  font-style: normal;
`;
export const PinDescription = styled.p`
  color: ${colors.white};
  text-align: center;
  ${fonts.detail1Regular}
  font-style: normal;
`;
