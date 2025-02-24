import {
    CardIconBox,
    InfoLine,
    InfoTitle,
    RechargeButton, RechargeText,
    Title,
    Wrapper
} from "@/pages/Payment/components/PaymentMethod/styles.ts";
import DingDongCard from "@/pages/Payment/components/DingDongCard";
import ArrowRightIcon from "@/components/designSystem/Icons/Home/ArrowRightIcon.tsx";
import {useNavigate} from "react-router-dom";


export default function PaymentMethod() {
    const naviagate = useNavigate()

    return (
        <Wrapper>
            <Title>
                결제 방식
            </Title>
            <InfoLine>
                <InfoTitle>
                    딩동머니로 결제
                </InfoTitle>
                <RechargeButton onClick={() => naviagate('/wallet')}>
                    <RechargeText>
                        충전하기
                    </RechargeText>
                    <ArrowRightIcon />
                </RechargeButton>
            </InfoLine>
            <CardIconBox>
                <DingDongCard />
            </CardIconBox>
        </Wrapper>
    )
}


