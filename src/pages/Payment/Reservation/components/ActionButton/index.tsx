import {ScheduleInterface} from "@/route/loader/payment/reservation/loader.tsx";
import {unitPrice} from "@/env.ts";
import {axiosInstance} from "@/api";
import {formatKst} from "@/utils/time/formatKst.ts";
import {useNavigate} from "react-router-dom";
import {queryClient} from "@/main.tsx";
import useToast from "@/hooks/useToast";
import {isAxiosError} from "axios";
import ActionButtonLayout from "@/pages/Payment/components/ActionButtonLayout";

interface ActionButtonProps {
    token: string
    schedule: ScheduleInterface
    wallet: number
}
export default function ActionButton({token, schedule, wallet}: ActionButtonProps) {
    const navigate = useNavigate();
    const isPaymentAvailable = (schedule.timeSchedule.length * unitPrice) <= wallet
    const addToast = useToast()


    const confirmPurchase = async () => {
        if (!isPaymentAvailable) {
            navigate('/wallet')
        }

        try {
            await axiosInstance.post('/api/users/reservations/general', {
                token: token,
                direction: schedule.direction,
                dates: schedule.timeSchedule.map(date => ({
                    date: formatKst(date)
                }))
            })

            // 결제 성공
            await queryClient.invalidateQueries({queryKey: ['/api/users/reservations']});
            sessionStorage.removeItem('/custom-bus-booking')
            navigate('/payment/success')
        }
        catch (error) {
            // 결제 실패
            if (isAxiosError(error) && error.response?.status === 400) {
                if (error.response.data.code === 'ALREADY_USED') {
                    addToast("결제 실패: 이미 처리된 결제 입니다.")
                }
                else if (error.response.data.code === 'INVALID' || error.response.data.code === 'INCORRECT_SIGNATURE') {
                    addToast("결제 실패: 잘못된 결제 정보 입니다.")
                }
                else if (error.response.data.code === 'EXPIRED') {
                    addToast("결제 실패: 결제 세션이 만료되었습니다.")
                }
                else {
                    addToast("결제 실패: 잘못된 결제 정보 입니다.")
                }
            }
            else {
                addToast("결제 실패: 네트워크 오류. 다시 시도해주세요.")
            }
        }

    }

    return (
        <ActionButtonLayout confirmPurchase={confirmPurchase} isPaymentAvailable={isPaymentAvailable} />
    )
}