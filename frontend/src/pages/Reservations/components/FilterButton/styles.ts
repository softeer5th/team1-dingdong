import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {Body2Regular} from "@/styles/typography.ts";

export const Button = styled.button.withConfig({
    shouldForwardProp: (prop) => prop !== "isActive"
})<{ isActive: boolean }>`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 99px;
    
    ${({ isActive }) =>
    isActive
        ? `border: 1px solid ${colors.orange900}; background-color: ${colors.orange100};`
        : `border: 1px solid ${colors.gray30};`}
`;

export const Text = styled(Body2Regular).withConfig({
    shouldForwardProp: (prop) => prop !== "isActive"
})<{ isActive: boolean }>`
    color: ${({ isActive }) => (isActive ? colors.orange900 : colors.gray100)};
`;