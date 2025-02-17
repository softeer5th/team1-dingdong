import styled from 'styled-components';
import {colors} from "@/styles/colors.ts";
import {Body1Regular, Body2Medium, Body2Regular, Body2SemiBold, Detail1Regular} from "@/styles/typography.ts";

export const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

export const FilterPanel = styled.div`
    position: sticky;
    z-index: 1;
    background-color: ${colors.gray0};
    overflow:scroll;
    top: 59px;
    padding: 20px 0;
    width: 100%;
    min-width: 0;
    min-height: 82px;
    white-space: nowrap; /* 자식 요소들이 줄바꿈되지 않도록 설정 */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
    }
    /* 좌우 20px씩 페이드 효과 */
    mask-image: linear-gradient(to right, rgba(255, 255, 255, 0), white 20px, white calc(100% - 20px), rgba(255, 255, 255, 0));
`;

export const FilterScroll = styled.ul`
    padding: 0 20px;
    width: fit-content;
    display: flex;
    gap: 8px;
`;

export const SortIndicator = styled.div`
    position: sticky;
    z-index: 1;
    background-color: ${colors.gray0};
    top: 140px;
    padding: 0 20px 3px;
    text-align: right;
`;

export const SortText = styled(Body2Regular)`
    color: ${colors.gray70};

    /* Body 2/Regular */
    font-family: Pretendard, serif;
    font-style: normal;
`;

export const HistoryScroll = styled.div`
    min-height: 0;
    //overflow: scroll;

    //mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), white 20px, white calc(100% - 20px), rgba(255, 255, 255, 0));
`;

export const HistoryList = styled.ul`
    display: flex;
    padding: 20px;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
`;

export const HistoryItem = styled.li`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

export const InfoBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const DateText = styled(Body2Regular)`
    color: ${colors.gray70};

    /* Body 2/Regular */
    font-family: Pretendard, serif;
    font-style: normal;
`;

export const TripInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const TripText = styled(Body2Medium)`
    color: ${colors.gray100};

    /* Body 2/Medium */
    font-family: Pretendard, serif;
    font-style: normal;
`;

export const TripDivide = styled.div`
    width: 0;
    height: 14px;
    border: 0.5px solid ${colors.gray30};
`;

export const StatusInfo = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
`;

export const BusNumber = styled(Body2SemiBold)`
    color: #0080FF;

    /* Body 2/Semibold */
    font-family: Pretendard, serif;
    font-style: normal;
`;

export const Status = styled(Detail1Regular)`
    color: ${colors.gray70};

    /* Detail 1/Regular */
    font-family: Pretendard, serif;
    font-style: normal;
`;

export const ArrivedAt = styled(Body2Regular)`
    color: #FF1E00;

    /* Body 2/Medium */
    font-family: Pretendard, serif;
    font-style: normal;
`;

export const Divide = styled.div`
    width: 100%;
    height: 0;
    border: 0.5px solid ${colors.gray20};
`;


export const NoItemWrapper = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const NoItemText = styled(Body1Regular)`
    color: ${colors.gray100};
`