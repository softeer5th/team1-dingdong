import { colors } from "@/styles/colors";
import { Body1Medium, Body2Medium } from "@/styles/typography";
import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Label = styled(Body1Medium)`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${colors.gray70};
`;

export const InputContainer = styled.div`
  width: 100%;
`;

export const StyledInput = styled(Body2Medium).attrs({ as: "input" })<{
  $hasError: boolean;
}>`
  display: flex;
  width: 100%;
  padding: 8px 11px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$hasError ? colors.red : colors.gray30)};
  color: ${colors.gray100};

  &::placeholder {
    color: ${colors.gray40};
  }
`;
