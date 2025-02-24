import styled from "styled-components";
import {colors} from "@/styles/colors.ts";


export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export const PageMain = styled.main`
    display: flex;
    flex-direction: column;
`

export const Divider = styled.div`
    height: 10px;
    align-self: stretch;
    background: ${colors.gray20};
`