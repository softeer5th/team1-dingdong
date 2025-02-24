import {Wrapper} from "@/pages/Wallet/component/HistoryList/styles.ts";
import {users_wallet_history_interface} from "@/api/query/users";
import {
    History,
    HistoryAmount,
    HistoryAmountBox, HistoryBalance,
    HistoryDate,
    HistoryStatus,
    HistoryStatusBox
} from "@/pages/Wallet/component/HistoryList/styles.ts";
import {getKstFormattedLabelPair} from "@/utils/time/getKstFormattedLabelPair.ts";
import LoadingCard from "@/pages/Home/component/LoadingCard";
import {getNextHistories} from "@/pages/Wallet/utils/getNextHistories.ts";
import {useRevalidator} from "react-router-dom";


export default function HistoryList({histories}: {histories: users_wallet_history_interface['histories']}) {
    const { revalidate, state } = useRevalidator()

    return (
        <Wrapper>
            {
                histories.content.map((content, index) => (
                    <HistoryItem key={index} content={content}/>
                ))
            }
            {
                histories.page.number < (histories.page.totalPages - 1) ?
                    <LoadingCard getNextBusState={(errorCallbackF) => getNextHistories(errorCallbackF, histories, revalidate, state)}/> : null
            }
        </Wrapper>
    )
}




function HistoryItem({ content }: {content: users_wallet_history_interface['histories']['content'][number]}) {
    const transactionStatus: Record<users_wallet_history_interface['histories']['content'][number]['type'], string> = {
        PAY: "예매",
        REFUND: "예매 환불",
        FREE_CHARGE: "무료 충전",
        WELCOME_MONEY_CHARGE: "첫 가입 충전"
    }
    const transactionColorType: Record<users_wallet_history_interface['histories']['content'][number]['type'], boolean> = {
        PAY: false,
        REFUND: true,
        FREE_CHARGE: true,
        WELCOME_MONEY_CHARGE: true
    }

    return (
        <History>
            <HistoryStatusBox>
                <HistoryStatus isDeposit={transactionColorType[content.type]}>
                    {transactionStatus[content.type]}
                </HistoryStatus>
                <HistoryDate>{getKstFormattedLabelPair(content.timeStamp).join(' ')}</HistoryDate>
            </HistoryStatusBox>
            <HistoryAmountBox>
                <HistoryAmount>{`${transactionColorType[content.type] ? '' : '-'}${content.amountMoney.toLocaleString()}원`}</HistoryAmount>
                <HistoryBalance>{'잔액 페이 ' + content.remainMoney.toLocaleString() + "원"}</HistoryBalance>
            </HistoryAmountBox>
        </History>
    );
}
