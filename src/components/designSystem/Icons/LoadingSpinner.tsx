import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.svg`
    animation: ${rotate} 1s linear infinite;
`;

export default function LoadingSpinner() {
    return (
        <Spinner xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 0C23.2843 0 30 6.5 30 15H26C26 9 21.0751 4 15 4C8.92487 4 4 8.92487 4 15C4 21.0751 9 26 15 26V30C5.5 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0Z" fill="black"/>
        </Spinner>
    );
}
