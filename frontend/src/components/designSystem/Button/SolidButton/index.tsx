import { ButtonContainer } from "./styles";
interface SolidButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SolidButton({
  type = "button",
  text = "확인",
  onClick = () => {},
  active = true,
}: SolidButtonProps) {
  return (
    <ButtonContainer
      type={type}
      disabled={!active}
      $active={active}
      onClick={onClick}
    >
      {text}
    </ButtonContainer>
  );
}
