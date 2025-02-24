import {ActionButton, Title, Wrapper} from "@/components/Headers/ExitHeader/styles.ts";
import CancelIcon from "@/components/designSystem/Icons/CancelIcon.tsx";
import {useNavigate} from "react-router-dom";

interface ExitHeaderProps {
    text: string;
    onClick?: () => void;
}
export default function ExitHeader({text, onClick}: ExitHeaderProps) {
    const navigate = useNavigate();

    const defaultOnClick = () => {
        navigate('/home')
    }

    return (
        <Wrapper>
            <Title>
                {text}
            </Title>
            <ActionButton onClick={onClick ?? defaultOnClick}>
                <CancelIcon />
            </ActionButton>
        </Wrapper>
    )
}