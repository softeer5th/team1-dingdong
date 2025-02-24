import styled from "styled-components";
import {Body1Regular, Heading1Bold} from "@/styles/typography.ts";
import {colors} from "@/styles/colors.ts";
import {CTAButtonB} from "@/styles/buttons.ts";


export const Backdrop = styled.div`
  position: fixed;
  z-index: 9999;
    top:0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
    background: rgba(0, 0, 0, 0.50);
`

export const ModalWrapper = styled.div`
  width: 315px;

  border-radius: 12px;
  background: ${colors.gray0};
`

export const ModalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 32px 20px;
  text-align: center;
`

export const ModalTitle = styled(Heading1Bold)`
  color: ${colors.gray100};
  white-space: break-spaces;
`;

export const ModalText = styled(Body1Regular)`
  color: ${colors.gray70};
`

export const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px 20px;
  justify-content: space-between;
  gap: 20px;
`

export const Button = styled(CTAButtonB)`
  flex: 1;
`

export const ButtonText = styled(Body1Regular)`
  color: ${colors.gray100};
`