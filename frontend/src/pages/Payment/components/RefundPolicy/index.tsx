import {Description, DescriptionList, Title, Wrapper} from "@/pages/Payment/components/RefundPolicy/styles.ts";

export default function RefundPolicy() {


    return (
        <Wrapper>
            <Title>
                환불 정책
            </Title>
            <DescriptionList>
                <li>
                    <Description>
                        48시간 전 취소 시 100% 환불
                    </Description>
                </li>
                <li>
                    <Description>
                        배차 실패 시 100% 환불
                    </Description>
                </li>
            </DescriptionList>
        </Wrapper>
    )
}