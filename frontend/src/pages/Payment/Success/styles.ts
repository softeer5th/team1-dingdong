import styled from "styled-components";
import {Body1Medium, Body2Medium, Heading2Bold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";
import {CTAButtonA, CTAButtonB} from "@/styles/buttons.ts";


export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
`

export const PageMain = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const CheckBox = styled.div`
    width: 70px;
    height: 70px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const PageTitle = styled(Heading2Bold)`
    color: ${colors.gray100};
    margin: 38px 0 12px;
`

export const PageSubTitle = styled(Body2Medium)`
    color: ${colors.gray70};
`

export const ActionButtonBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
`

export const ActionButtonHome = styled(CTAButtonA)`
    width: 100%;
`

export const ActionButtonReservations = styled(CTAButtonB)`
    width: 100%;
`

export const ActionButtonText = styled(Body1Medium).withConfig({
    shouldForwardProp: (props) => props !== 'isWhite',
})<{isWhite?: boolean}>`
    color: ${({isWhite = false}) => isWhite ? colors.gray0 : colors.gray100};
`