import {axiosInstance} from "@/api";
import {queryClient} from "@/main.tsx";
import {isAxiosError} from "axios";
import {NavigateFunction} from "react-router-dom";
import {ScheduleInterface} from "@/route/loader/payment/reservation/loader.tsx";
import removeReservationCache from "@/api/queryCacheRemove/reservations/removeReservationCache.ts";
import {formatUtcToKst} from "@/utils/time/formatUtcToKst.tsx";




export async function confirmPurchase (
    isPaymentAvailable: boolean,
    navigate: NavigateFunction,
    token: string,
    addToast: (msg: string) => void,
    api: {
        type: 'general'
        schedule: ScheduleInterface,
    } | {
        type: 'together',
        busScheduleId: number,
        busStopId: number
    }) {

    if (!isPaymentAvailable) {
        navigate('/wallet')
        return
    }

    try {

        api.type === 'general' ?
            await axiosInstance.post(`/api/users/reservations/general`, {
                token: token,
                direction: api.schedule.direction,
                dates: api.schedule.timeSchedule.map(date => ({
                    date: formatUtcToKst(date)
                }))
            }) :
            await axiosInstance.post('/api/users/reservations/together', {
                token,
                busStopId: api.busStopId,
                busScheduleId: api.busScheduleId
            })



        // 결제 성공
        // 결제 내역 관련 지우기
        queryClient.removeQueries({
            predicate: (query) =>
                Array.isArray(query.queryKey) && // queryKey가 배열인지 확인
                (
                    query.queryKey[0] === "/api/users/wallet/history" ||
                    query.queryKey[0] === "/api/users/wallet/balance"
                )
        })

        // 배차 대기 갱신 시키기
        if (api.type === 'general') {
            removeReservationCache('PENDING')
        }
        else {
            removeReservationCache('ALLOCATED')
        }
        removeReservationCache('HOME')
        removeReservationCache('ALL')

        // 함께타기는 ALLOCATED인데, 이것은 캐시를 안하기에 안해도 된다.



        api.type === 'general' ?
            sessionStorage.removeItem('/custom-bus-booking') :
            sessionStorage.removeItem('/fixed-bus-select-bus')

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
            else if (error.response.data.code === 'NO_SEATS') {
                addToast("결제 실패: 남은 좌석이 없습니다.")
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