import { colors } from "@/styles/colors";
import styled from "styled-components";

export const SelectionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0px 20px;
  overflow-x: scroll;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;
export const TimeSelectButton = styled.button<{ $isHighlighted: boolean }>`
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 99px;
  border: 1px solid
    ${(props) => (props.$isHighlighted ? colors.orange900 : colors.gray30)};

  color: ${(props) =>
    props.$isHighlighted ? colors.orange900 : colors.gray100};

  font-size: 14px;
  font-weight: 400;

  background-color: ${(props) =>
    props.$isHighlighted ? colors.orange100 : "white"};
  margin-bottom: 23px;
`;
