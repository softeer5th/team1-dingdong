import {queryClient} from "@/main.tsx";
import {users_wallet_history_interface} from "@/api/query/users";
import {INIT_WALLET_PAGE, INIT_WALLET_PAGE_SIZE, unitPrice} from "@/env.ts";


export function addRefundHistory() {
    queryClient.setQueryData<users_wallet_history_interface>(
        ['/api/users/wallet/history', {page: INIT_WALLET_PAGE, pageSize: INIT_WALLET_PAGE_SIZE}],
        (oldData) => {
            if (oldData == null) return oldData;

            const newData: users_wallet_history_interface = {
                histories: {
                    content: [
                        {
                            timeStamp: (new Date()).toISOString(),
                            type: "REFUND",
                            amountMoney: unitPrice,
                            remainMoney: oldData.histories.content[0].remainMoney + unitPrice
                        },
                        ...oldData.histories.content.slice(0, -1)
                    ],
                    page: oldData.histories.page,
                }
            }

            return newData
        }
    )
}