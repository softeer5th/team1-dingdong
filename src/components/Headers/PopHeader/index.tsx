import {LeftBox, NavButton, Title, Wrapper} from "@/components/Headers/PopHeader/styles.ts";
import ArrowLeftIcon from "@/components/designSystem/Icons/ArrowLeftIcon";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {ReactNode} from "react";


export const handleBack = (navigate: NavigateFunction) => {
    if (window.history.length > 2) {
        navigate(-1);
    } else {
        navigate("/home", { replace: true });
    }
};

interface PropHeaderProps {
    text: string;
    children?: ReactNode;
}
export default function PopHeader({text, children}: PropHeaderProps) {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <LeftBox>
                <NavButton onClick={() => handleBack(navigate)}>
                    <ArrowLeftIcon />
                </NavButton>
                <Title>
                    {text}
                </Title>
            </LeftBox>
            {children}
        </Wrapper>
    )
}