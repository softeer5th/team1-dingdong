import { colors } from "@/styles/colors";
import styled from "styled-components";

export const SaveButtonContainer = styled.button`
  display: inline-flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 2px;

  border-radius: 4px;
  border: 1px solid ${colors.gray30};
  background-color: ${colors.gray0};
  color: ${colors.orange900};
`;
