import {getFreeChargeAvailable} from "@/api/wallet/getFreeChargeAvailable.ts";
import {postFreeCharge} from "@/api/wallet/postFreeCharge.ts";
import {FREE_CHARGE_PRICE, INIT_WALLET_PAGE, INIT_WALLET_PAGE_SIZE} from "@/env.ts";
import {queryClient} from "@/main.tsx";
import {users_wallet_history_interface} from "@/api/query/users";
import {RevalidationState} from "react-router-dom";


export async function actFreeCharge (revalidate: () => void, addToast: (msg: string) => void, state: RevalidationState): Promise<void> {
    if (state === 'loading') return;

    try {
        if ((await getFreeChargeAvailable()).available) {
            await postFreeCharge()
            addToast("무료 충전이 성공 했습니다.")
            queryClient.setQueryData<users_wallet_history_interface>(
                ['/api/users/wallet/history', {page: INIT_WALLET_PAGE, pageSize: INIT_WALLET_PAGE_SIZE}],
                (oldData) => {
                    if (oldData == null) return oldData;

                    const newData:users_wallet_history_interface = {
                        histories: {
                            ...oldData.histories,
                            content: [
                                {
                                    timeStamp: new Date().toISOString(),
                                    type: "FREE_CHARGE",
                                    amountMoney: FREE_CHARGE_PRICE,
                                    remainMoney: FREE_CHARGE_PRICE + oldData.histories.content[0].remainMoney
                                },
                                ...oldData.histories.content
                            ]
                        }
                    }

                    return newData
                }
            )
            // loader 재실행
            revalidate()
        }
        else{
            addToast("무료 충전은 1일 한번 입니다.")
        }
    }
    catch (error) {
        addToast("네트워크에 에러가 발생했어요.")
    }
}