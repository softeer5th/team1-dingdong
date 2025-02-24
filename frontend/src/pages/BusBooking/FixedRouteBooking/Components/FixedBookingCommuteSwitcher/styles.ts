import styled from "styled-components";
import { fonts } from "@/styles/fonts";
import { colors } from "@/styles/colors";
import { Body1Medium, Detail1Medium } from "@/styles/typography";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
  gap: 20px;

  position: sticky;
  top: 60px;
  background-color: white;
  z-index: 2;
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: column;
  :hover {
    cursor: pointer;
  }
`;

export const SubtitleText = styled(Detail1Medium)`
  text-align: center;
  color: ${colors.gray70};
`;

export const CommuteViewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const DeparturePoint = styled.div`
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  border-radius: 8px;
  border: 1px solid ${colors.gray30};
  background-color: ${colors.gray10};
  width: 100%;
`;

export const Destination = styled(DeparturePoint)``;

export const PointTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const TitleText = styled.p`
  text-align: center;
  ${fonts.body1Medium};
  color: ${colors.gray70};
`;

export const LocationName = styled(Body1Medium)`
  ${fonts.body1Medium};
  color: ${colors.gray100};
`;

export const HomeIcon = styled.div`
  width: 18px;
  height: 18px;
  background: url("/icons/home.svg") no-repeat center / contain;
`;
