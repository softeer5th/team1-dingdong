import React from "react";
import { InputContainer, InputWrapper, Label, StyledInput } from "./styles";
import { Star } from "@/pages/SetHomeLocation/components/BottomModal/styles";

interface CustomInputProps {
  name?: string; // ✅ name 추가!
  onClick?: () => void;
  hasError?: boolean;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  starNeed?: boolean;
  maxLength?: number;
  readonly?: boolean;
}

export default function CustomInput({
  name,
  maxLength,
  hasError = false,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  starNeed = true,
  onClick,
  readonly = false,
}: CustomInputProps) {
  return (
    <InputWrapper>
      <Label>
        {label} {starNeed && <Star>*</Star>}
      </Label>
      <InputContainer>
        <StyledInput
          maxLength={maxLength}
          name={name}
          onClick={onClick}
          $hasError={hasError}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readonly}
        />
      </InputContainer>
    </InputWrapper>
  );
}
