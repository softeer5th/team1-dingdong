import { colors } from "@/styles/colors";
import styled from "styled-components";

export const OpenTagContainer = styled.button<{ active: boolean }>`
  display: inline-flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 99px;

  background-color: ${(props) =>
    props.active ? colors.orange100 : colors.gray0};

  color: ${(props) => (props.active ? colors.orange900 : colors.gray100)};

  border: 1px solid
    ${(props) => (props.active ? colors.orange900 : colors.gray30)};
`;
