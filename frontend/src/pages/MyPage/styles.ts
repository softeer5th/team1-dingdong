import styled from "styled-components";
import {colors} from "@/styles/colors.ts";
import {Body1SemiBold, Body2Medium} from "@/styles/typography.ts";


export const PageWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const Main = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
`

export const UserProfileBox = styled.div`
    padding: 20px;
    display: flex;
    width: 100%;
    gap: 16px;
`

export const UserProfile = styled.div`
    width: 44px;
    height: 44px;
`

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

export const UserName = styled(Body1SemiBold)`
    color: ${colors.textDontEditTextPrimary};
`

export const UserEmail = styled(Body2Medium)`
    color: ${colors.textDontEditTextPrimary};
`

export const ItemTitle = styled(Body1SemiBold)`
    color: ${colors.gray100};
`

export const ItemButton = styled.button`
    padding: 20px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`

export const ItemDivde = styled.div`
    height: 12px;
    background-color: ${colors.gray20};
`