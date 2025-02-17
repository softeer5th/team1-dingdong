import ArrowLeftIcon from "@/components/designSystem/Icons/BusTracker/ArrowLeftIcon.tsx";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {handleBack} from "@/components/Headers/PopHeader";


export default function PopBox() {
    const navigate = useNavigate();


    return (
        <Wrapper onClick={() => handleBack(navigate)}>
            <ArrowLeftIcon />
        </Wrapper>
    )
}


export const Wrapper = styled.button`
    position: fixed;
    top: 21px;
    left: 12px;
    z-index: 1;
`