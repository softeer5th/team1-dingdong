import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {Body1SemiBold} from "@/styles/typography.ts";
import {CTAButtonA, CTAButtonB} from "@/styles/buttons.ts";

export const Backdrop = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.50);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 2;
`

export const Modal = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== "isMount"
})<{isMount: boolean}>`
    position: relative;
    border-radius: 24px 24px 0px 0px;
    box-shadow: 0px -4px 8px 0px rgba(34, 34, 53, 0.04);
    width: 100%; // 기본값 (화면이 440px보다 작을 때)
    padding: 24px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: ${colors.gray0};

    @media (min-width: 440px) {
        width: 375px; // 화면이 440px 이상일 때
    }
    
    transform: translateY(${({ isMount }) => (isMount ? 0 : 100)}%);
    transition: transform 0.2s ease-in-out;
`

export const Title = styled(Body1SemiBold)`
    color: ${colors.gray100};
`

export const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 10px;
`

export const LeftButton = styled(CTAButtonB)`
    flex: 1;
`

export const LeftText = styled(Body1SemiBold)`
    color: ${colors.gray100};
`

export const RightButton = styled(CTAButtonA)`
    flex: 1;
`

export const RightText = styled(Body1SemiBold)`
    color: ${colors.gray0};
`