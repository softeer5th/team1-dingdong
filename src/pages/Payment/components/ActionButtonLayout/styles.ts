import styled from "styled-components";
import {CTAButtonA, CTAButtonB} from "@/styles/buttons.ts";
import {Body1SemiBold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";

export const ActionButtonBox = styled.div`
    margin-top: 42px;
    width: 100%;
    display: flex;
    gap: 10px;
    padding: 20px;
`

export const ActionButtonPop = styled(CTAButtonB)`
    flex: 1;
`

export const ActionButtonPopText = styled(Body1SemiBold)`
    color: ${colors.gray100};
`

export const ActionButtonPay = styled(CTAButtonA)`
    flex: 1;
`
export const ActionButtonPayText = styled(Body1SemiBold)`
    color: ${colors.gray0};
`