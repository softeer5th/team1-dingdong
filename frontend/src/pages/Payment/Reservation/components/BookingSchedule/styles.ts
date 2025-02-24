import styled from "styled-components";
import {Body1SemiBold, Body2Medium, Detail1Medium, Heading2Bold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";


export const Wrapper = styled.section`
    width: 100%;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
`

export const Title = styled(Heading2Bold)`
    color: ${colors.gray100};
    margin-bottom: 20px;
`

export const InfoBox = styled.div`
    margin-bottom: 24px;
`

export const InfoText = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'isHighlight'
})<{isHighlight?: boolean}>`
    color: ${({isHighlight = false}) => isHighlight ? colors.orange900 : colors.gray100};
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
`

export const DirectionBox = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
`

export const DirectionType = styled(Body2Medium)`
    display: flex;
    height: 28px;
    padding: 10px 8px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
    background: ${colors.gray20};
    margin-right: 8px;
`

export const DirectionTypeText = styled(Detail1Medium)`
    color: ${colors.gray70};
`

export const DirectionText = styled(Body1SemiBold)`
    color: ${colors.gray100};
    /* 같은 형제들 중 첫 번째인 경우 */
    &:first-of-type {
        /* 첫 번째에만 적용할 스타일 */
        margin-right: 4px;
    }

    /* 같은 형제들 중 마지막인 경우 */
    &:last-of-type {
        /* 마지막에만 적용할 스타일 */
        margin-left: 4px;
    }
`

export const TableWrapper = styled.div`
    width: 100%;
`

export const TableHead = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'textAlignLeft'
})<{textAlignLeft?: boolean}>`
    width: 100%;
    padding-bottom: 10px;
    border-bottom: ${colors.gray30} 1px solid;
    text-align: ${({textAlignLeft = true}) => (textAlignLeft ? 'left' : 'right')};
`
export const TableText = styled(Body2Medium).withConfig({
    shouldForwardProp: (prop) => prop !== 'color',
})<{color: string}>`
    color: ${({ color }) => color};
`

export const TableBody = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'textAlignLeft'
})<{textAlignLeft?: boolean}>`
    padding-top: 10px;
    width: 100%;
    text-align: ${({textAlignLeft = true}) => (textAlignLeft ? 'left' : 'right')};
`