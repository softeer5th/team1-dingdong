import {createRoot} from "react-dom/client";
import Lottie from 'react-lottie';
import animationData from '@/assets/lottie/busLoadingAnimation.json'
import {Backdrop, LoadingText, Modal} from "@/components/Loading/styles.ts";
import {ReactNode, useEffect} from "react";
import {createPortal} from "react-dom";



interface LoadingModalProps {
    text: string;
}
export default function LoadingModal({text}: LoadingModalProps) {

    useEffect(() => {
        // 컴포넌트 마운트 시 스크롤을 막음
        document.body.style.overflow = 'hidden';

        // 컴포넌트 언마운트 시 스크롤을 복구
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);



    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return  createPortal(
        <Backdrop>
            <Modal>
                <Lottie width={140} height={105}
                        options={defaultOptions}/>
                <LoadingText>
                    {text}
                </LoadingText>
            </Modal>
        </Backdrop>,
        document.body
    )
}


// 헬퍼 함수
export function mountModal() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);

    // React 18의 createRoot를 사용하여 LoadingModal 렌더링
    const root = createRoot(modalContainer);

    // 모달 언마운트 함수. 스코프 체인 활용
    function unmountModal() {
        root.unmount();          // 컴포넌트를 unmount
        modalContainer.remove(); // 컨테이너를 DOM에서 제거
    }

    function render(children: ReactNode) {
        root.render(children)
    }

    // url 변경 되면 제거
    window.addEventListener(
        "popstate",
        () => {
            unmountModal();
        },
        { once: true }
    );


    return {render, unmountModal}
}
