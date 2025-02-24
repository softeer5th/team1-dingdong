import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Pretendard';
  font-weight: 700;
  font-display: swap;
  src:
    local('Pretendard Bold'),
    url('/fonts/Pretendard-Bold.subset.woff2') format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-weight: 600;
  font-display: swap;
  src:
    local('Pretendard SemiBold'),
    url('/fonts/Pretendard-SemiBold.subset.woff2') format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-weight: 500;
  font-display: swap;
  src:
    local('Pretendard Medium'),
    url('/fonts/Pretendard-Medium.subset.woff2') format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-weight: 400;
  font-display: swap;
  src:
    local('Pretendard Regular'),
    url('/fonts/Pretendard-Regular.subset.woff2') format('woff2');
}

@font-face {
    font-family: 'Happiness-Sans-Title';
    font-weight: 400;
    font-display: swap;
    src: url('/fonts/Happiness-Sans-Title.woff2') format('woff2');
}

@font-face {
    font-family: 'Happiness-Sans';
    font-weight: 700;
    font-display: swap;
    src: url('/fonts/Happiness-Sans-Bold.woff2') format('woff2');
}
@font-face {
    font-family: 'Happiness-Sans';
    font-weight: 400;
    font-display: swap;
    src: url('/fonts/Happiness-Sans-Regular.woff2') format('woff2');
}
@font-face {
    font-family: 'PressStart2P';
    font-weight: 400;
    font-display: swap;
    src: url('/fonts/PressStart2P-Regular.ttf')
}

  html, body {
    font-family:'Pretendard', sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }
  
`;

export default GlobalStyle;
