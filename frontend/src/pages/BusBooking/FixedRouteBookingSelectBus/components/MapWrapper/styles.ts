import { colors } from "@/styles/colors";
import { fonts } from "@/styles/fonts";
import { Detail1Medium } from "@/styles/typography";
import styled from "styled-components";

// 위치

export const MapWrapper = styled.section`
  height: calc(100% - 60px - 57px - 280px);
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

export const UserHomePinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UserHomePinMark = styled.div`
  display: flex;
  width: auto;
  height: 30px;
  width: 30px;
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  background-color: ${colors.orange900};
`;
export const HomePinMark = styled.div`
  display: flex;
  height: 36px;
  width: auto;
  justify-content: center;
  border-radius: 8px;
  background-color: ${colors.gray90};

  padding: 8px 12px 8px 8px;
  align-items: center;
  gap: 4px;
  align-self: stretch;
`;

export const HomePinTitle = styled.div`
  color: ${colors.gray90};
  ${fonts.body2SemiBold}
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Destination = styled(Detail1Medium).attrs({ as: "div" })`
  color: white;
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

export const EndPointText = styled.p`
  position: absolute;
  color: white;
  text-align: center;
  left: 4.5px;
  top: 5px;

  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 160% */
`;
