import { colors } from "@/styles/colors";
import { Body2Regular, Body2SemiBold } from "@/styles/typography";
import styled from "styled-components";

export const Wrapper = styled.div<{
  $isRead?: boolean;
  $cursorPointer: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  position: relative;

  background-color: ${({ $isRead }) => ($isRead ? "white" : colors.orange50)};
  cursor: ${({ $cursorPointer }) => ($cursorPointer ? "pointer" : "default")};
  border-bottom: 1px solid ${colors.gray20};
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

export const Ticket = styled.div`
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;
export const AlarmText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
`;

export const Description = styled(Body2Regular)`
  color: ${colors.gray70};
`;

export const LinkBox = styled(Body2SemiBold)`
  color: ${colors.orange900};
  display: flex;
  align-items: center;
`;
