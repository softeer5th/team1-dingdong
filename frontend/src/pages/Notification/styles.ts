import { colors } from "@/styles/colors";
import { Body2Regular } from "@/styles/typography";
import styled from "styled-components";

export const NotificationCardWrapper = styled.div`
  padding-bottom: 54px;
`;
export const NotificationLimit = styled(Body2Regular).attrs({ as: "div" })`
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  background-color: ${colors.gray10};
  color: ${colors.gray70};

  position: fixed;
  bottom: 0;
  width: inherit;
`;

export const Subtitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitleType = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.gray100};
`;

export const Time = styled.span`
  font-size: 14px;
  color: ${colors.gray50};
`;
