import styled from "styled-components";

export const PageWrapper = styled.div`
  height: 100%;
  background-color: white;
  width: 100%;

  position: relative;
  @media (min-width: 441px) {
    width: 375px; /* 화면 너비가 440px을 넘으면 375px로 고정 */
  }
`;

export const LayoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
