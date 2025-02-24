import { colors } from "@/styles/colors";
import { Body1Medium, Body2Medium, Body2Regular } from "@/styles/typography";
import styled from "styled-components";

export const EmailFormWrapper = styled.div`
  width: 100%;
`;

export const Label = styled(Body1Medium)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 4px;
  color: ${colors.gray70};
`;

export const EmailInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  width: 100%;
  margin-bottom: 10px;
`;

export const EmailInput = styled(Body2Medium).attrs({ as: "input" })<{
  $hasError: boolean;
}>`
  display: flex;
  padding: 8px 11px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$hasError ? colors.red : colors.gray30)};

  color: ${colors.gray100};
`;

export const VerifyButton = styled(Body2Medium).attrs({ as: "button" })<{
  $active: boolean;
}>`
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 2px;

  border-radius: 4px;
  border: 1px solid ${colors.gray30};

  color: ${(props) => (props.$active ? colors.orange900 : colors.gray30)};
`;

export const VerificationTimeText = styled(Body2Regular)<{
  $hasError: boolean;
}>`
  color: ${(props) => (props.$hasError ? colors.red : colors.gray50)};
`;

export const NextButtonWrapper = styled.div`
  position: fixed;
  width: inherit;
  bottom: 0;
  background-color: white;
  display: flex;
  padding: 20px;
`;

export const SchoolSelectWrapper = styled.div`
  width: 100%;
`;
