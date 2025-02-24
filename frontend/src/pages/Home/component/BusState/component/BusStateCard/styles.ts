import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {radius} from "@/styles/radius.ts";
import {
    Body1Medium,
    Body2Medium,
    Body2Regular,
    Body2SemiBold,
    Detail1Medium, Detail1Regular,
    Heading2Bold
} from "@/styles/typography.ts";

export const Card = styled.li`
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;

    border-radius: ${radius.medium}px;
    border: 1px solid ${colors.gray30};
    background: ${colors.gray0};
`
export const CardHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`

export const CardInfo = styled.div`
    display: flex;
    text-align: left;
    gap: 8px;
`
export const CardTIme = styled(Heading2Bold)`
    color: ${colors.gray100};
    font-family: Pretendard,serif;
    font-style: normal;
`
export const CardLocation = styled(Body1Medium)`
    color: ${colors.gray100};
    font-family: Pretendard,serif;
    font-style: normal;
`
export const CardState = styled.div`
    display: flex;
    height: 28px;
    padding: 10px 8px;
    justify-content: center;
    min-width: fit-content;
    align-items: center;
    border-radius: 4px;
    background: ${colors.gray20};
`
export const CardStateText = styled(Detail1Medium)`
    color: ${colors.gray70};
    font-family: Pretendard,serif;
    font-style: normal;
`
export const CardBusInfo = styled.div`
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
    align-items: center;
`
export const CardBusNumber = styled(Body2SemiBold)`
    color: #0080FF;
    font-family: Pretendard,serif;
    font-style: normal;
`
export const ArrivalTime = styled(Body2Medium)`
    color: #FF1E00;
    text-align: right;
    font-family: Pretendard,serif;
    font-style: normal;
`
export const CardDestination = styled.div`
    display: flex;
    gap: 8px;
`
export const CardDestinationText = styled(Body2Regular)`
    color: ${colors.gray70};
    font-family: Pretendard,serif;
    font-style: normal;
`
export const Divider = styled.div`
    width: 0;
    height: 14px;
    border: solid 0.5px ${colors.gray30};
`
export const CardAction = styled.button`
    margin-top: 10px;
    display: flex;
    padding: 10px 0;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;

    border-radius: 8px;
    border: 1px solid ${colors.gray30};
    background: ${colors.gray0}
`
export const CardActionText = styled(Detail1Regular)`
    color: ${colors.gray100};
    font-family: Pretendard,serif;
    font-style: normal;
`