import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {Body1Medium, Body2Medium, Detail1Medium} from "@/styles/typography.ts";

export const ScheduledDepartures = {
    Wrapper: styled.section`
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        background-color: ${colors.gray10};
    `,
    Slider: styled.div`
        position: relative;
        overflow: hidden;
        width: 100%;
    `,
    Card: styled.div.withConfig({
        shouldForwardProp: (prop) => prop !== "isAbsolute"
    })<{isAbsolute?: boolean, count?: number}>`
        ${({isAbsolute = false}) => (
        isAbsolute ?
            'position: absolute; top: 0px;' :
            'position: relative;'
    )}
        ${({ count }) => count != null ?
        `transform: translateX(${110 * count}%); transition: transform 0.3s ease-in-out;` : ''}
        padding: 0 20px;
        width: 100%;
    `,
    CardHeader: styled.div`
        height: 52px;
        border-radius: 12px;
        background: ${colors.gray90};
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    `,
    Title: styled(Body1Medium)`
        color: ${colors.gray0};
        font-style: normal;
    `,
    Direction: styled.div`
        display: flex;
        padding: 6px 10px;
        align-items: center;
        gap: 4px;
        border-radius: 99px;
        background: ${colors.gray80};
    `,
    DirectionText: styled(Detail1Medium)`
        color: #FFF;
        font-style: normal;
    `,
    CardBody: styled.div`
        padding: 20px;
        display: flex;
        gap: 10px;
        border-radius: 12px;
        background: ${colors.gray80};
    `,
    InfoBox: styled.div`
        display: flex;
        flex: 1;
        min-width: 0;
        padding: 12px 0;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 8px;
        background: ${colors.gray0};
    `,
    InfoText: styled(Body2Medium)`
        color: ${colors.gray100};
        max-width: 100%;
        text-align: center;
        /* Body 2/Medium */
        font-style: normal;
        
        white-space: nowrap; /* 줄바꿈 방지 */
        overflow: hidden; /* 넘치는 내용 숨김 */
        text-overflow: ellipsis; /* 넘치는 부분 ... 처리 */
    `,
    CardPunchHole: styled.div.withConfig({
        shouldForwardProp: (prop) => prop !== "left"
    })<{ left: boolean }>`
        z-index: 1;
        position: absolute;
        width: 24px;
        height: 24px;
        background-color: ${colors.gray10};
        transform: translateY(-50%);
        margin: 0 20px;
        ${({left}) => left ? `left: -12px` : 'right: -12px'};
        border-radius: 99px;
    `,
    SliderControls: styled.div`
        display: flex;
        width: auto;
        justify-content: center;
        align-items: center;
        gap: 16px;
    `,
    SlideCounter: styled.span.withConfig({
        shouldForwardProp: (prop) => prop !== "isCurrent"
    })<{isCurrent?: boolean}>`
        color: ${({isCurrent = false}) => isCurrent ? colors.orange900 : colors.gray70};
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 21px */
    `,
    SlideButton: styled.button`
        display: flex;
        width: 44px;
        height: 32px;
        padding: 4px 2px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        border-radius: 99px;
        border: 1px solid ${colors.gray30};
        background: ${colors.gray0};
    `
}