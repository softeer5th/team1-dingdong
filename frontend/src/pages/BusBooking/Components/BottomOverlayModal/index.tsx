import React, { useEffect, useState } from "react";

import { ModalContainer, Overlay } from "./styles";
import { createPortal } from "react-dom";
interface BottomOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomOverlayModal({
  isOpen,
  onClose,
  children,
}: BottomOverlayModalProps) {
  if (!isOpen) return null;

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false); // 오픈할 때는 닫힘 애니메이션 없애기
    }
  }, [isOpen]);

  return createPortal(
    <Overlay
      onClick={() => {
        setIsClosing(true);
        setTimeout(onClose, 300); // 애니메이션 완료 후 실제 모달 닫기
      }}>
      <ModalContainer
        isOpen={isOpen}
        isClosing={isClosing}
        onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContainer>
    </Overlay>,
    document.getElementById("root") as HTMLDivElement
  );
}
