import { ButtonContainer } from "./styles";
interface CancelReservationButtonProps {
  text?: string;
  active: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CancelReservationButton({
  text = "예매 취소",
  onClick = () => {},
  active = false,
}: CancelReservationButtonProps) {
  return (
    <ButtonContainer active={active} onClick={onClick}>
      {text}
    </ButtonContainer>
  );
}
