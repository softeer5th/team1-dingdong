import { colors } from "@/styles/colors";
import { fonts } from "@/styles/fonts";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  0% {
    transform: translateY(100%); /* 화면 아래로 시작 */
    opacity: 0.5;
  }
  100% {
    transform: translateY(0); /* 제자리로 이동 */
    opacity: 1;
  }
`;

// 밑 모달
export const BottomModal = styled.div<{ showBottomSheet: boolean }>`
  position: absolute;
  background-color: ${colors.white};
  position: absolute;
  bottom: 0;
  z-index: 1;

  width: 100%;
  height: 217px;

  display: ${(props) => (props.showBottomSheet ? "flex" : "none")};
  padding: 24px 20px 20px 20px;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 24px 24px 0px 0px;
  box-shadow: 0px -4px 8px 0px rgba(34, 34, 53, 0.04);

  animation: ${slideUp} 0.3s ease-out;
`;
export const LocationInputContainer = styled.div`
  color: ${colors.gray70};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

export const Star = styled.div`
  color: ${colors.error100};
  /* Default/Forms/Label */
  font-family: "Helvetica Neue";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
export const InputTitle = styled.div`
  color: var(--gray-70, #59596e);
  ${fonts.body1Medium}
  display: flex;
  gap: 5px;
`;

export const InputBox = styled.input`
  display: flex;
  padding: 8px 11px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  color: ${colors.gray100};
  border-radius: 4px;
  border: 1px solid ${colors.gray30};
  height: 40px;
`;
export const Address = styled.div`
  color: ${colors.gray70};
  margin-top: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%; /* 21px */
`;
export const Warning = styled.div`
  color: red;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%; /* 21px */
`;
