import {queryClient} from "@/main.tsx";
import {users_wallet_history_interface} from "@/api/query/users";
import {formatUtcToKst} from "@/utils/time/formatUtcToKst.tsx";
import {unitPrice} from "@/env.ts";


export function addRefundHistory() {
    queryClient.setQueryData<users_wallet_history_interface>(
        ['/api/users/wallet/history'],
        (oldData) => {
            if (oldData == null) return oldData;

            const newData: users_wallet_history_interface = {
                histories: {
                    content: [
                        {
                            timeStamp: formatUtcToKst((new Date()).toISOString()),
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