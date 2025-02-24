import styled from "styled-components";
import {Body1Medium, Body2Medium, Heading2Bold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";


export const Wrapper = styled.section`
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
`

export const Title = styled(Heading2Bold)`
    color: ${colors.gray100};
    margin-bottom: 10px;
`

export const InfoLine = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 34px;
`

export const InfoTitle = styled(Body1Medium)`
color: ${colors.gray100};
`

export const RechargeButton = styled.button`
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    align-items: center;
`

export const RechargeText = styled(Body2Medium)`
    color: ${colors.gray70};
`

export const CardIconBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`