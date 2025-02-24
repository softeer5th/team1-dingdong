import {queryClient} from "@/main.tsx";
import {users_wallet_history, users_wallet_history_interface} from "@/api/query/users";
import { INIT_WALLET_PAGE, INIT_WALLET_PAGE_SIZE} from "@/env.ts";
import {RevalidationState} from "react-router-dom";


export function getNextHistories (errorCallbackF: Function, histories: users_wallet_history_interface['histories'], revalidate: () => Promise<void>, state: RevalidationState) {
    if (state === 'loading') return;

    queryClient.ensureQueryData(users_wallet_history({
        page: histories.page.number + 1,
        pageSize: histories.page.size,
    })).then((result) => {

        queryClient.setQueryData<users_wallet_history_interface>(
            ['/api/users/wallet/history', {
                page: INIT_WALLET_PAGE,
                pageSize: INIT_WALLET_PAGE_SIZE
            }],
            (oldData) => {
                // 심각한 에러, 코딩 에러임
                if (oldData == null) return oldData;

                const newData: users_wallet_history_interface = {
                    histories: {
                        content: [
                            ...oldData.histories.content,
                            ...result.histories.content
                        ],
                        page: result.histories.page
                    }
                }
                return newData
            }
        )

        revalidate()

        // loader 재실행
    }).catch((err) => {
        errorCallbackF(err)
    })
}