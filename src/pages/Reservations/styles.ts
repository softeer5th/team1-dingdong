import styled from "styled-components";
import {colors} from "@/styles/colors.ts";


export const PageWrapper = styled.div`
    max-width: 440px;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${colors.gray0};
`

export const PageMain = styled.main`
    display: flex;
    flex-direction: column;
`