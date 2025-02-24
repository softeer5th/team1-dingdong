import { ReactNode } from "react";
import { LoginForm } from "./styles";

interface FormWrapperProps {
  children: ReactNode;
}

export default function CustomFormWrapper({ children }: FormWrapperProps) {
  return <LoginForm.Wrapper>{children}</LoginForm.Wrapper>;
}
