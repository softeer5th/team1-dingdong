import { colors } from "@/styles/colors";
import styled from "styled-components";

export const ButtonContainer = styled.button`
  display: flex;
  width: 295px;
  padding: 10px 0px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid ${colors.gray30};
  background-color: ${colors.gray0};
`;

export const Text = styled.div`
  color: ${colors.gray100};
`;
