import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {Body1Medium, Body1SemiBold, Body2Medium, Heading2Bold} from "@/styles/typography.ts";
import {radius} from "@/styles/radius.ts";
import {CTAButtonA} from "@/styles/buttons.ts";


export const SaveButton = styled.button`
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 2px;
    border-radius: 4px;
    border: 1px solid ${colors.gray30};
    background: #FFF;
`

export const SaveButtonText = styled(Body2Medium)`
    color: ${colors.orange900};
    text-align: right;
`

export const PageMain = styled.main`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 20px;
    height: 100%;
`

export const PageTitle = styled(Heading2Bold)`
    color: ${colors.gray100};
    margin: 24px 0 8px;
`

export const PageDescription = styled(Body2Medium)`
    color: ${colors.gray70};
    margin-bottom: 24px;
`


export const TableWrapper = styled.div`
    padding: 20px;
    border-radius: ${radius.medium}px;
    background: ${colors.gray10};
    border: 1px solid ${colors.gray30};
`

export const TableHeader = styled.div`
    width: 100%;
    text-align: left;
`

export const TableHeaderText = styled(Body1Medium)`
    color: ${colors.gray70};
    text-align: left;
`

export const TableCell = styled.div`
    display: flex;
    padding: 8px 8px 8px 11px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    height: 44px;


    border-radius: 4px;
    border: 2px solid ${colors.gray30};
    background: ${colors.gray0};
`

export const TableCellText = styled(Body2Medium)`
    color: ${colors.gray100};
`

export const ImgRegistrationBox = styled.div`
    display: flex;
    width: 100%;
    gap: 10px;
    padding: 20px 0;
`

export const ImgActionButton = styled(CTAButtonA)`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 8px;
`

export const ImgActionText = styled(Body1SemiBold)`
    color: ${colors.gray0};
`

export const PageInfoSection = styled.div`
    width: 100%;
    display: flex;
    gap: 4px;
    margin-bottom: 110px;
`

export const PageInfoTextBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`


export const InfoTitle = styled(Body2Medium)`
    color: ${colors.gray70};
`

export const InfoText = styled.span`
    color: ${colors.gray70};

    /* Detail 1/Regular */
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 133.333% */
`