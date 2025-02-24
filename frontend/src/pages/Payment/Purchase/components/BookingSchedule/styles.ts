import styled from "styled-components";
import {Body1SemiBold, Heading2Bold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";


export const Wrapper = styled.section`
    padding: 24px 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const Title = styled(Heading2Bold)`
    color: ${colors.gray100};
`

export const Card = styled.div`
    display: flex;
    width: 100%;
    padding: 10px 20px 20px 20px;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    border-radius: 12px;
    border: 1px solid ${colors.gray30};
    background: #FFF;
`

export const CardTitle = styled(Body1SemiBold)`
    color: ${colors.gray100};
`

export const CardLine = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${colors.gray30};
`

export const CardBody = styled.div`
    display: flex;
    width: 100%;
    gap: 10px;
`

export const CardBodyItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    flex: 1;
`

export const CardBodyItemText = styled.span`
    color: ${colors.gray100};
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */
`