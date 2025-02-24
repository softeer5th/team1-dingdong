import removeReservationCache from "@/api/queryCacheRemove/reservations/removeReservationCache.ts";
import {addRefundHistory} from "@/pages/Wallet/utils/addRefundHistory.ts";
import {deleteItem} from "@/pages/SocketLayout/utils/deleteItem.ts";
import {changeItem} from "@/pages/SocketLayout/utils/changeItem.ts";
//import {getLatestNotification} from "@/pages/SocketLayout/utils/getLatestNotification.ts";

type NotificationType = 'ready' | 'run' | 'failed'
type NotificationHandlers = Record<NotificationType, (addToast: (msg: string) => void, reservationId: number) => Promise<void> >
const notificationHandlers: NotificationHandlers = {
    // 배차 실패 -> 배차 대기 & 배차 실패 캐시 지우기
    failed: async (addToast, reservationId) => {
        try {
            // id 기반 예매 상태 갈아끼우기
            await changeItem({reservationId, category: 'ALL'})

            // 배차 대기 1개 지우고 1개 가져오기
            await deleteItem({deletedReservationId: reservationId, category: 'PENDING'})
            await deleteItem({deletedReservationId: reservationId, category: 'HOME'})

            // 실패 위치를 모르니 캐시 지우기
            removeReservationCache('FAIL_ALLOCATED')
        } catch (error) {

        } finally {

            // 결제 내역 갱신
            // 잔고 갱신
            addRefundHistory()
            addToast("예매한 차량 중 배차가 실패한 건이 있어요.")
        }
    },
    // 배차 성공 -> 배차 대기 캐시 지우기
    ready: async (addToast, reservationId) => {
        try {
            // id 기반 예매 상태 갈아끼우기
            await changeItem({reservationId, category: 'HOME'})
            await changeItem({reservationId, category: 'ALL'})

            // 배차 대기 1개 지우고 1개 가져오기
            await deleteItem({deletedReservationId: reservationId, category: 'PENDING'})

            // 할당은 위치를 모르니 캐시 지우기
            removeReservationCache('ALLOCATED')

            addToast(`예매한 차량 중 배차가 완료된 건이 있어요. 내역을 가져왔어요.`)
        } catch (error) {
            addToast(`예매한 차량 중 배차가 완료된 건이 있어요. 내역을 가져오지 못했어요.`)
        }
    },
    // 버스 출발 -> 뭐하징 이건
    run: async (addToast, reservationId) => {
        // 여기서는 버스 추적 캐시 지우기

        try {
            // id 기반 예매 상태 갈아끼우기
            await changeItem({reservationId, category: 'HOME'})
            await changeItem({reservationId, category: 'ALL'})
            await changeItem({reservationId, category: 'ALLOCATED'})

            addToast(`예매한 차량 중 출발한 건이 있어요. 내역을 가져왔어요.`)
        } catch (error) {
            addToast("예매한 차량 중 출발한 건이 있어요. 내역을 가져오지 못했어요.")
        }
    }
}


export const handleMessage = async (message: MessageEvent, addToast: (msg: string) => void, revalidate: ()=>Promise<void>) => {
    const data = message.data;
    if (typeof data !== 'string' || !data.startsWith('alarm')) return;
    const dataList = data.split('_')
    if (!(dataList[1] === 'ready' || dataList[1] === 'run')) return;

    const type: 'ready' | 'run' | 'failed' = dataList[1] ?? 'failed'
    const reservationId = parseInt(dataList[2] ?? '-1', 10)

    console.log("소켓 데이터", data)
    if (reservationId === -1) {
        return ;
    }
    try {
        const handler = notificationHandlers[type];
        await handler(addToast, reservationId)

        // 갱신된 캐시로 리렌더링 시키기
        await revalidate().then(() => console.log("재검증 성공"))

    } catch (error) {
        console.error("소켓 데이터 에러")
        // 흠... 어떻게 에러 처리하지? 안해도 되지 않나?
    }
};