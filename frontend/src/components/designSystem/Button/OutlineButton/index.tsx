import { ButtonContainer } from "./styles";
interface OutlineButtonProps {
  text?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function OutlineButton({
  text = "취소",
  onClick = () => {},
}: OutlineButtonProps) {
  return <ButtonContainer onClick={onClick}>{text}</ButtonContainer>;
}
