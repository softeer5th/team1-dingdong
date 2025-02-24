import styled from "styled-components";
import {Body1SemiBold, Body2Medium, Heading2SemiBold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";
import {CTAButtonA} from "@/styles/buttons.ts";

export const Wrapper = styled.div`
    display: flex;
    padding: 12px 20px 20px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
`
export const TextBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
`
export const Title=  styled(Heading2SemiBold)`
    color: ${colors.gray100};
    font-family: Pretendard, serif;
    font-style: normal;
`
export const Detail = styled(Body2Medium)`
    color: ${colors.gray70};
    font-family: Pretendard, serif;
    font-style: normal;
`
export const ReserveButton = styled(CTAButtonA)``
export const ReserveButtonText = styled(Body1SemiBold)`
    color: ${colors.gray0};
    font-family: Pretendard, serif;
    font-style: normal;
`