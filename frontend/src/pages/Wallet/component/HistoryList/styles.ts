import styled from "styled-components";
import {Body1SemiBold, Body2Regular} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";

const DIVFlexColumns = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export const Wrapper = styled.ul`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
    padding: 20px 0;
`

export const History = styled.li`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

export const HistoryStatusBox = styled(DIVFlexColumns)`
    align-items: flex-start;
`
export const HistoryStatus = styled(Body1SemiBold).withConfig({shouldForwardProp: prop => prop !== 'isDeposit'})<{isDeposit: boolean}>`
    color: ${({isDeposit}) => isDeposit ? colors.blue200 : colors.red100};
`

export const HistoryDate = styled(Body2Regular)`
    color: ${colors.gray90}
`

export const HistoryAmountBox = styled(DIVFlexColumns)`
    align-items: flex-end;
`

export const HistoryAmount = styled(Body1SemiBold)`
    color: ${colors.gray90};
`

export const HistoryBalance = styled(Body2Regular)`
    color: ${colors.gray90};
`