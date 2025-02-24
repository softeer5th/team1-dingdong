import ExitHeader from "@/components/Headers/ExitHeader";
import BookingSchedule from "@/pages/Payment/Purchase/components/BookingSchedule";
import PricingInfo from "@/pages/Payment/components/PricingInfo";
import PaymentMethod from "@/pages/Payment/components/PaymentMethod";
import {
    Divider,
    PageMain, PageWrapper
} from "@/pages/Payment/Purchase/styles.ts";
import {useLoaderData} from "react-router-dom";
import {users_wallet_balances_interface} from "@/api/query/users";
import {ScheduleInterface} from "@/route/loader/payment/purchase/loader.tsx";
import ActionButton from "@/pages/Payment/Purchase/components/ActionButton";


export default function Page() {
    const [{token}, { balance: wallet }, schedule]: [{token: string}, users_wallet_balances_interface, ScheduleInterface] = useLoaderData()

    return (
        <PageWrapper>
            <ExitHeader text={"함께 타기"} />
            <PageMain>
                <BookingSchedule direction={schedule.direction} time={schedule.timeSchedule} busStopName={schedule.busStopName}/>
                <Divider />
                <PricingInfo count={1} wallet={wallet} />
                <Divider />
                <PaymentMethod />
                <ActionButton token={token} wallet={wallet} busStopId={schedule.busStopId} busScheduleId={schedule.busId} />
            </PageMain>
        </PageWrapper>
    )
}