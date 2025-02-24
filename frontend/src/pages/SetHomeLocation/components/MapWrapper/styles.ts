import { colors } from "@/styles/colors";
import { fonts } from "@/styles/fonts";
import styled from "styled-components";

// 위치
export const MapContainer = styled.div``;
export const MapWrapper = styled.section`
  height: calc(100% - 60px);
`;

export const PinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const HomePinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HomePinMark = styled.div`
  display: flex;
  width: auto;
  height: 30px;
  width: 30px;
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  background-color: ${colors.orange900};
`;

export const HomePinTitle = styled.div`
  color: ${colors.gray90};
  ${fonts.body2SemiBold}
  display: flex;
  justify-content: center;
  align-items: center;
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
