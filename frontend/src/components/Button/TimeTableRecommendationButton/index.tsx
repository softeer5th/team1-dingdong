import { TIMETABLE_RECOMMENDATION_TEXT } from "@/constants/buttonTexts";
import SparklesIcon from "@/components/designSystem/Icons/SparklesIcon";
import CheckCircleIcon from "@/components/designSystem/Icons/CheckCircleIcon";
import { ButtonContainer, Text } from "./styles";
interface AIRecommendationButtonProps {
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function TimeTableRecommendationButton({
  onClick = () => {},
  active = false,
}: AIRecommendationButtonProps) {
  return (
    <ButtonContainer onClick={onClick} type="button">
      {active ? (
        <>
          <CheckCircleIcon />
          <Text $active={active}>
            {TIMETABLE_RECOMMENDATION_TEXT.getRecommendation}
          </Text>
        </>
      ) : (
        <>
          <SparklesIcon />
          <Text $active={active}>
            {TIMETABLE_RECOMMENDATION_TEXT.requestRecommendation}
          </Text>
        </>
      )}
    </ButtonContainer>
  );
}
