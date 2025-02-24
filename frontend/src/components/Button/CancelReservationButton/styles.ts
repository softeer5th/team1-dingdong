import { colors } from "@/styles/colors";
import styled from "styled-components";

export const ButtonContainer = styled.button<{ active: boolean }>`
  display: inline-flex;
  height: 36px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  border-radius: 4px;
  background-color: ${(props) => (props.active ? colors.gray0 : colors.gray30)};

  color: ${(props) => (props.active ? colors.gray100 : colors.gray0)};

  border: 1px solid ${colors.gray30};
`;
