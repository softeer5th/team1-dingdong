import styled from "styled-components";
import {radius} from "@/styles/radius.ts";
import {colors} from "@/styles/colors.ts";
import {Body2Medium, Heading2SemiBold} from "@/styles/typography.ts";

export const Wrapper = styled.section`
    margin: 0 20px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    border-radius: ${radius.medium || 12}px;
    background: ${colors.gray0 || "#FFF"};
`
export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
`
export const Row = styled.div`
    display: flex;
    height: 24px;
    align-items: center;
    gap: 4px;
`
export const Text = styled(Body2Medium)`
    color: ${colors.gray70};
    text-align: center;
    font-style: normal;
`
export const SvgBox = styled.button`
    display: flex;
    width: 14px;
    height: 24px;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
export const Title = styled(Heading2SemiBold)`
    color: ${colors.gray100};
    text-align: center;
    font-family: Pretendard, serif;
    font-style: normal;
`
export const Divider = styled.div`
    width: 0;
    height: 52px;
    border: solid 0.5px #F3F3F6;
`


