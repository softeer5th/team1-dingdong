import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {Body1Regular} from "@/styles/typography.ts";


export const Backdrop = styled.div`
    position: fixed;
    z-index: 9999;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    inset: 0;
    background: rgba(255, 255, 255, 0.1); /* 반투명 */
    backdrop-filter: blur(10px); /* 블러 효과 */
`

export const Modal = styled.div`
    display: flex;
    width: 290px;
    height: 290px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 31px;
    flex-shrink: 0;
    
    border-radius: 12px;
    background: ${colors.gray0};
`

export const LoadingText = styled(Body1Regular)`
    color: ${colors.gray70}
`