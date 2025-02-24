import React, { useState } from "react";
import {
  ChevronIconWrapper,
  DropdownButton,
  DropdownContainer,
  DropdownItem,
  DropdownList,
  SchoolName,
} from "./styles";
import ChevronRightIcon from "@/components/designSystem/Icons/ChevronRightIcon";
type SchoolType = {
  schoolName: string;
  schoolId: number;
};
interface SchoolDropdownProps {
  schoolList: SchoolType[];
  setSchoolId: React.Dispatch<React.SetStateAction<number>>;
}
export default function SchoolDropdown({
  schoolList,
  setSchoolId,
}: SchoolDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("학교 선택");

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <SchoolName>{selected}</SchoolName>
        <ChevronIconWrapper>
          <ChevronRightIcon />
        </ChevronIconWrapper>
      </DropdownButton>
      <DropdownList $isOpen={isOpen}>
        {schoolList.map(({ schoolName, schoolId }) => (
          <DropdownItem
            key={schoolName}
            onClick={() => {
              setSelected(schoolName);
              setIsOpen(false);
              setSchoolId(schoolId);
            }}
          >
            {schoolName}
          </DropdownItem>
        ))}
      </DropdownList>
    </DropdownContainer>
  );
}
