import { CHECK_BUS_LOCATION_TEXT } from "@/constants/buttonTexts";

import { ButtonContainer, Text } from "./styles";
import VectorIcon from "@/components/designSystem/Icons/VectorIcon";

interface CheckBusLocationButtonProps {
  isDeparture?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CheckBusLocationButton({
  onClick = () => {},
  isDeparture = false,
}: CheckBusLocationButtonProps) {
  return (
    <ButtonContainer onClick={onClick}>
      {isDeparture ? (
        <>
          <Text>{CHECK_BUS_LOCATION_TEXT.departed}</Text>
          <VectorIcon />
        </>
      ) : (
        <>
          <Text>{CHECK_BUS_LOCATION_TEXT.notDeparted}</Text>
          <VectorIcon />
        </>
      )}
    </ButtonContainer>
  );
}
