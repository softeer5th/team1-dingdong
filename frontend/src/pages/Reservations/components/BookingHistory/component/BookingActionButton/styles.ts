import styled from "styled-components";
import {Body2Medium} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";


export const ActionButton = styled.button`
    display: flex;
    height: 36px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    min-width: fit-content;

    border-radius: 4px;
    border: 1px solid ${colors.gray30};
    background: ${colors.gray0};


    &:disabled {
        background: ${colors.gray30};
    }
`
export const ActionText = styled(Body2Medium).withConfig({
    shouldForwardProp: (prop) => prop !== "disabled"
})<{disabled: boolean}>`
    color: ${({disabled}) => disabled ? colors.gray0 : colors.gray100};

    font-style: normal;
`