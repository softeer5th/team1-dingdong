import { SaveButtonContainer } from "./styles";
interface SaveButtonContainer {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function OpenTagProps({
  text = "저장",
  onClick = () => {},
}: SaveButtonContainer) {
  return <SaveButtonContainer onClick={onClick}>{text}</SaveButtonContainer>;
}
