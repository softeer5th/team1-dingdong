import {
    ActionButtonBox,
    ActionButtonPay,
    ActionButtonPayText,
    ActionButtonPop,
    ActionButtonPopText
} from "@/pages/Payment/components/ActionButtonLayout/styles.ts";
import {useNavigate} from "react-router-dom";

interface ActionButtonProps {
    confirmPurchase: () => Promise<void>;
    isPaymentAvailable: boolean
}
export default function ActionButtonLayout({confirmPurchase, isPaymentAvailable}: ActionButtonProps) {
    const navigate = useNavigate();


    return (
        <ActionButtonBox>
            <ActionButtonPop onClick={() => navigate(-1)}>
                <ActionButtonPopText>
                    이전
                </ActionButtonPopText>
            </ActionButtonPop>
            <ActionButtonPay  onClick={confirmPurchase}>
                <ActionButtonPayText>
                    {
                        isPaymentAvailable ? '결제하기' : '충전하기'
                    }
                </ActionButtonPayText>
            </ActionButtonPay>
        </ActionButtonBox>
    )
}