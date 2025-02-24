// src/styles/resetStyle.ts
import { createGlobalStyle } from 'styled-components';

const ResetStyle = createGlobalStyle`
  /* 기본 여백 제거 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 기본 글꼴 설정 및 높이 조정 */
  html, body {
    height: 100%;
    font-size: 100%;
    font-family: sans-serif;
    line-height: 1.5;
  }

  /* 기본 블록 요소 스타일 초기화 */
  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  /* 리스트 스타일 초기화 */
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* 링크 기본 스타일 제거 */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* 폼 요소 기본 스타일 제거 */
  button, input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
    background: none;
  }

  /* 이미지 기본 스타일 제거 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  button:hover {
      cursor: pointer;
  }
`;

export default ResetStyle;
