import styled from "styled-components";
import {colors} from "@/styles/colors.ts";


export const CTAButtonA = styled.button`
    display: flex;
    height: 50px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 4px;
    background: ${colors.orange900};

    &:hover, &:active {
        background: ${colors.orangeHover};
    }
    
    &:disabled {
        background: ${colors.gray40}
    }
`;

export const CTAButtonB = styled.button`
    display: flex;
    height: 50px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
    border: 1px solid ${colors.gray30};
    background: ${colors.gray0};
`