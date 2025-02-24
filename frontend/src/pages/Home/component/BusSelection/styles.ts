import styled from "styled-components";
import { radius } from "@/styles/radius.ts";
import { colors } from "@/styles/colors.ts";
import { Body2Medium, Heading1Bold } from "@/styles/typography.ts";

const ButtonWrapper = styled.button`
  display: flex;
  justify-content: center;
  height: 200px;
  flex: 1;
  padding: 20px;
  flex-shrink: 0;
  border-radius: ${radius.medium}px;
`;

export const Wrapper = styled.section`
  display: flex;
  margin: 0 20px;
  justify-content: space-between;
  gap: 10px;
`;

export const LeftButton = styled(ButtonWrapper)`
  background: linear-gradient(
    204deg,
    ${colors.orange200} 5.11%,
    ${colors.orange500} 93.09%
  );
`;

export const RightButton = styled(ButtonWrapper)`
  background: linear-gradient(157deg, #ddefff 25.41%, #afd5ff 95.5%);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Title = styled(Heading1Bold)`
  font-family: Pretendard, serif;
  font-style: normal;
  color: ${colors.gray100};
`;

export const Detail = styled(Body2Medium)`
  font-family: Pretendard, serif;
  font-style: normal;
  color: ${colors.gray70};
  text-align: left;
`;

export const SvgContainer = styled.div`
  max-width: 122px;
  align-items: center;
  svg {
    width: 100%;
  }
`;
