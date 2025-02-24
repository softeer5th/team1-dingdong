
import {unitPrice} from "@/env.ts";
import {useNavigate} from "react-router-dom";
import useToast from "@/hooks/useToast";
import ActionButtonLayout from "@/pages/Payment/components/ActionButtonLayout";
import {confirmPurchase} from "@/pages/Payment/utils/confirmPurchase.ts";

interface ActionButtonProps {
    token: string
    busStopId: number
    busScheduleId: number
    wallet: number
}
export default function ActionButton({token, busStopId, busScheduleId, wallet}: ActionButtonProps) {
    const navigate = useNavigate();
    const isPaymentAvailable = unitPrice <= wallet
    const addToast = useToast()


    return (
        <ActionButtonLayout confirmPurchase={() => confirmPurchase(isPaymentAvailable, navigate, token, addToast, {type: 'together', busScheduleId, busStopId})} isPaymentAvailable={isPaymentAvailable} />
    )
}