import { colors } from "@/styles/colors";
import styled from "styled-components";

export const ButtonContainer = styled.button`
  display: inline-flex;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 4px;
  border: 1px solid ${colors.gray30};
  background-color: ${colors.gray0};
`;

export const Text = styled.div<{ $active: boolean }>`
  color: ${(props) => (props.$active ? colors.orange900 : colors.gray70)};
`;
