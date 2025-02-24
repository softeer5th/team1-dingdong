import { colors } from "@/styles/colors";
import BusIcon from "../Home/BusIcon";
import ExclamationIcon from "./ExclamationIcon";
import styled from "styled-components";

const BusFailContainer = styled.div`
  position: relative;
  display: flex;
`;
const ExclamationIconWrapper = styled.div`
  position: absolute;
  top: -7px;
  right: -4px;
`;
export default function BusFailIcon() {
  return (
    <>
      <BusFailContainer>
        <BusIcon fill={colors.gray90} width={15} height={18} />
        <ExclamationIconWrapper>
          <ExclamationIcon />
        </ExclamationIconWrapper>
      </BusFailContainer>
    </>
  );
}
