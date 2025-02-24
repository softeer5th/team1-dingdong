import { colors } from "@/styles/colors";
import { Body1SemiBold, Heading2SemiBold } from "@/styles/typography";
import styled from "styled-components";

export const LoginHome = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(180deg, #fff 54.33%, #ffedb5 100%);
  `,

  Logo: styled.div`
    margin-bottom: 22px;
  `,

  SubTitle: styled(Heading2SemiBold)`
    color: ${colors.gray100};
    margin-bottom: 34px;
  `,

  IconWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 100px;
  `,

  ButtonWrapper: styled.div`
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  LoginButton: styled(Body1SemiBold).attrs({ as: "button" })`
    width: 100%;
    padding: 12px;
    background-color: ${colors.orange900};
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  `,

  SignUpButton: styled.button`
    color: ${colors.gray800};
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px; /* 162.5% */
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  `,

  FooterText: styled.p`
    font-size: 12px;
    color: ${colors.gray70};
    margin-top: 20px;
  `,
};
