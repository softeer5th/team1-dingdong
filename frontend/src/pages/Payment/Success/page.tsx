import Lottie from 'react-lottie';
import animationData from '@/assets/lottie/checkingAnimation.json'

import RefundPolicy from "@/pages/Payment/components/RefundPolicy";
import {
    ActionButtonBox, ActionButtonHome, ActionButtonReservations, ActionButtonText,
    CheckBox,
    PageMain,
    PageSubTitle,
    PageTitle,
    PageWrapper
} from "@/pages/Payment/Success/styles.ts";
import {useNavigate} from "react-router-dom";


export default function Page() {
    const navigate = useNavigate();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <PageWrapper>
            <PageMain>
                <CheckBox>
                    <div>
                        <Lottie
                            options={defaultOptions} width={'250px'} height={'250px'}/>
                    </div>
                </CheckBox>
                <PageTitle>
                    예매를 완료했어요!
                </PageTitle>
                <PageSubTitle>
                    48시간 전에 배차 정보를 꼭 확인해주세요
                </PageSubTitle>
            </PageMain>
            <RefundPolicy />
            <ActionButtonBox>
                <ActionButtonHome onClick={() => navigate('/home')}>
                    <ActionButtonText isWhite={true}>
                        홈으로
                    </ActionButtonText>
                </ActionButtonHome>
                <ActionButtonReservations onClick={() => navigate('/reservations')}>
                    <ActionButtonText>
                        예매 내역 확인
                    </ActionButtonText>
                </ActionButtonReservations>
            </ActionButtonBox>
        </PageWrapper>
    )
}