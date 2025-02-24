import { OpenTagContainer } from "./styles";
interface OpenTagProps {
  text: string;
  active: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function OpenTagProps({
  text = "배차 완료",
  onClick = () => {},
  active = false,
}: OpenTagProps) {
  return (
    <OpenTagContainer active={active} onClick={onClick}>
      {text}
    </OpenTagContainer>
  );
}
