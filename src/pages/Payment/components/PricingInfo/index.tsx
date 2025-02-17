import {
    InfoLine, InfoLineDivider, InfoText, InfoTextBold,
    InfoTitle,
    InfoTitleBox,
    Title,
    Wrapper
} from "@/pages/Payment/components/PricingInfo/styles.ts";
import {unitPrice} from "@/env.ts";


interface PricingInfoProps {
    count: number
    wallet: number
}
export default function PricingInfo({count, wallet}: PricingInfoProps) {

    return (
        <Wrapper>
            <Title>요금 정보</Title>
            <InfoLine>
                <InfoTitleBox>
                    <InfoTitle>금액</InfoTitle>
                    <InfoTitle>|</InfoTitle>
                    <InfoTitle>1회</InfoTitle>
                </InfoTitleBox>
                <InfoText>{unitPrice.toLocaleString()}원</InfoText>
            </InfoLine>
            <InfoLine>
                <InfoTitle>딩동머니 잔액</InfoTitle>
                <InfoText>{wallet.toLocaleString()}원</InfoText>
            </InfoLine>
            <InfoLineDivider />
            <InfoLine>
                <InfoTitle>최종 결제 금액</InfoTitle>
                <InfoTextBold>{(count * unitPrice).toLocaleString()}원</InfoTextBold>
            </InfoLine>
        </Wrapper>
    );
}