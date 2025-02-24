import {Button, Text} from "@/pages/Reservations/components/FilterButton/styles.ts";

type FilterButtonProps = {
    text: string;
    onClick: () => void;
    isActive?: boolean;
}
export default function FilterButton({text, onClick, isActive = false}: FilterButtonProps) {
    return (
        <Button isActive={isActive} onClick={onClick}>
            <Text isActive={isActive}>
                {text}
            </Text>
        </Button>
    )
}