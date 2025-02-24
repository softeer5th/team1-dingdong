import styled from "styled-components";


export const Wrapper = styled.div`
    position: relative;
    width: 221.4px;
    height: 135px;
    flex-shrink: 0;
    border-radius: 4px;
    background: linear-gradient(116deg, #FFCC4B 12.07%, #FF8F17 68.04%);
`

export const Text = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'right' && prop !== 'bottom'
})<{right: number, bottom: number}>`
    position: absolute;
    right: ${({right}) => right}px;
    bottom: ${({bottom}) => bottom}px;


    color: rgba(255, 255, 255, 0.44);
    font-family: "PressStart2P",serif;
    font-size: 26.327px;
    font-style: normal;
    font-weight: 400;
    line-height: 32.909px; /* 125% */
`;
