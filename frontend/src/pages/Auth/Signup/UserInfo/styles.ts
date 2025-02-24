import { colors } from "@/styles/colors";
import { Body2Regular } from "@/styles/typography";
import styled from "styled-components";

export const NameGuideText = styled(Body2Regular)<{ $hasError: boolean }>`
  color: ${(props) => (props.$hasError ? colors.red : colors.gray50)};
  margin-top: -10px;
`;
