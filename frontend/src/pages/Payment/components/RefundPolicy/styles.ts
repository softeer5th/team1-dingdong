import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {Body2Regular, Body2SemiBold} from "@/styles/typography.ts";


export const Wrapper = styled.div`
    display: flex;
    padding: 12px;
    margin: 0 20px;
    flex-direction: column;
    gap: 8px;
    align-self: stretch;
    border-radius: 4px;
    background: ${colors.gray10};
`

export const Title = styled(Body2SemiBold)`
    color: ${colors.gray70};
`

export const DescriptionList = styled.ul`

    li {
        position: relative;
        margin-left: 22px;
    }
    
    li:before {
        position: absolute;
        content: '•';
        left: -12px;
    }
`

export const Description = styled(Body2Regular)`
    color: ${colors.gray70};
`