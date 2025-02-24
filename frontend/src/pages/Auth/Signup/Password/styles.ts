import { colors } from "@/styles/colors";
import { Body2Regular } from "@/styles/typography";
import styled from "styled-components";

export const PasswordGuidText = styled(Body2Regular).attrs({ as: "div" })<{
  $textColor: string;
}>`
  color: ${(props) => props.$textColor};
  margin-top: -10px;
  height: 40px;
`;

export const ValidGuideText = styled(Body2Regular).attrs({ as: "div" })<{
  $isValid: boolean;
}>`
  color: ${(props) => (props.$isValid ? "green" : colors.red)};
  margin-top: -10px;
  height: 40px;
`;
