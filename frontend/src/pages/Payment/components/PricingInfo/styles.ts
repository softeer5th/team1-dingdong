import styled from "styled-components";
import {Body2Medium, Heading2Bold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";


export const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    padding: 24px 20px;
`

export const Title = styled(Heading2Bold)`
    color: ${colors.gray100};
    margin-bottom: 20px;
`

export const InfoLine = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    
    margin-bottom: 10px;
    &:last-child{
        margin-top: 10px;
        margin-bottom: 0;
    }
`

export const InfoTitleBox = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

export const InfoTitle = styled(Body2Medium)`
    color: ${colors.gray70};
`

export const InfoText = styled(Body2Medium)`
    color: ${colors.gray100};
`

export const InfoTextBold = styled(Heading2Bold)`
    color: ${colors.gray100};
`

export const InfoLineDivider = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${colors.gray30};
`