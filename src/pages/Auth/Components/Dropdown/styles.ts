import { colors } from "@/styles/colors";
import styled from "styled-components";

export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;
export const SchoolName = styled.div`
  color: ${colors.gray100};
`;
export const DropdownButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const ChevronIconWrapper = styled.div`
  transform: rotate(90deg);
`;

export const DropdownList = styled.ul<{ $isOpen: boolean }>`
  overflow-y: scroll;
  max-height: 200px;
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  padding: 8px 0;
  list-style: none;
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  transform: translateY(${(props) => (props.$isOpen ? "0" : "-10px")});
  transition: all 0.2s ease-in-out;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
`;

export const DropdownItem = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
