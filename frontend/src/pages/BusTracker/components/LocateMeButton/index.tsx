import {ButtonWrapper} from "@/pages/BusTracker/components/LocateMeButton/styles.ts";
import LocateMeIcon from "@/components/designSystem/Icons/BusTracker/LocateMeIcon.tsx";



interface LocateMeButtonProps {
    onClick: () => void;
}
export default function LocateMeButton({onClick}: LocateMeButtonProps) {


    return (
        <ButtonWrapper onClick={onClick}>
            <LocateMeIcon />
        </ButtonWrapper>
    )
}