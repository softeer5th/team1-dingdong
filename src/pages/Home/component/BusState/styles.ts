import styled from "styled-components";
import {colors} from "@/styles/colors.ts";

export const Wrapper = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    background: ${colors.gray0};
`
export const Header = styled.header`
    display: flex;
    padding: 24px 20px 10px 20px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
`
export const HeaderLeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`
export const HeaderTitle = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== "isZero"
})<{isZero?: boolean}>`
    color: ${({isZero = true}) => isZero ? colors.gray100 : colors.orange900};
    font-family: Pretendard, serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
`
export const HeaderRightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`
export const HeaderInfoText = styled.span`
    color: ${colors.gray70};
    font-family: Pretendard, serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
`
export const HeaderActionButton = styled.button`
    display: flex;
    width: 14px;
    height: 24px;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
export const CardList = styled.ul`
    display: flex;
    padding: 0 20px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
`