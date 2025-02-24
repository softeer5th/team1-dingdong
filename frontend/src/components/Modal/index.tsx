import ErrorIcon from "@/components/designSystem/Icons/ErrorIcon.tsx";
import {createPortal} from "react-dom";
import {
    Backdrop,
    Button,
    ButtonBox, ButtonText,
    ModalInfo,
    ModalText,
    ModalTitle,
    ModalWrapper
} from "@/components/Modal/styles.ts";
import {Fragment, useEffect} from "react";

interface ButtonInterface {
    onClick: () => void;
    text: string;
}
interface ModalProps {
    title: string[];
    text: string[];
    isError?: boolean;
    leftButton?: ButtonInterface,
    rightButton?: ButtonInterface,
}
export default function Modal({title, text, isError = false, leftButton = undefined, rightButton = undefined}: ModalProps) {

    useEffect(() => {
        // 컴포넌트 마운트 시 스크롤을 막음
        document.body.style.overflow = 'hidden';

        // 컴포넌트 언마운트 시 스크롤을 복구
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return createPortal(
        <Backdrop>
            <ModalWrapper>
                <ModalInfo>
                    <ModalTitle>
                        {
                            title.map((item, index) => (
                                <Fragment key={index}>
                                    {item}
                                    {index < title.length - 1 && <br />}
                                </Fragment>
                            ))
                        }
                    </ModalTitle>
                    {
                        isError ? <ErrorIcon /> : null
                    }
                    <ModalText>
                        {
                            text.map((item, index) => (
                                <Fragment key={index}>
                                    {item}
                                    {index < text.length - 1 && <br />}
                                </Fragment>
                            ))
                        }
                    </ModalText>
                </ModalInfo>
                <ButtonBox>
                    {
                        leftButton ?
                            <Button onClick={leftButton.onClick}>
                                <ButtonText>
                                    {leftButton.text}
                                </ButtonText>
                            </Button> :
                            null
                    }
                    {
                        rightButton ?
                            <Button onClick={rightButton.onClick}>
                                <ButtonText>
                                    {rightButton.text}
                                </ButtonText>
                            </Button> :
                            null
                    }
                </ButtonBox>
            </ModalWrapper>
        </Backdrop>,
        document.body
    )
}