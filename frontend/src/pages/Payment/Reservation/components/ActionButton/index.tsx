import {ScheduleInterface} from "@/route/loader/payment/reservation/loader.tsx";
import {unitPrice} from "@/env.ts";
import {useNavigate} from "react-router-dom";
import useToast from "@/hooks/useToast";
import ActionButtonLayout from "@/pages/Payment/components/ActionButtonLayout";
import {confirmPurchase} from "@/pages/Payment/utils/confirmPurchase.ts";

interface ActionButtonProps {
    token: string
    schedule: ScheduleInterface
    wallet: number
}
export default function ActionButton({token, schedule, wallet}: ActionButtonProps) {
    const navigate = useNavigate();
    const isPaymentAvailable = (schedule.timeSchedule.length * unitPrice) <= wallet
    const addToast = useToast()


    return (
        <ActionButtonLayout confirmPurchase={() => confirmPurchase(isPaymentAvailable, navigate, token, addToast, {type: 'general', schedule})} isPaymentAvailable={isPaymentAvailable} />
    )
}