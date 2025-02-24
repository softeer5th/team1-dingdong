import { colors } from "@/styles/colors";
import { Heading2SemiBold } from "@/styles/typography";
import styled from "styled-components";

export const PageTitle = styled.div`
  display: flex;

  align-items: center;
`;

export const TitleName = styled(Heading2SemiBold)`
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 10px;
  color: ${colors.gray100};
`;
