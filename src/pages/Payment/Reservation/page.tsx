import ExitHeader from "@/components/Headers/ExitHeader";
import BookingSchedule from "@/pages/Payment/Reservation/components/BookingSchedule";
import PricingInfo from "@/pages/Payment/components/PricingInfo";
import PaymentMethod from "@/pages/Payment/components/PaymentMethod";
import {
    Divider,
    PageMain, PageWrapper
} from "@/pages/Payment/Purchase/styles.ts";
import RefundPolicy from "@/pages/Payment/components/RefundPolicy";
import {useLoaderData} from "react-router-dom";
import {users_home_locations_interface, users_me_interface, users_wallet_balances_interface} from "@/api/query/users";
import {ScheduleInterface} from "@/route/loader/payment/reservation/loader.tsx";
import ActionButton from "@/pages/Payment/Reservation/components/ActionButton";


export default function Page() {
    const [
        { token },
        { schoolName },
        { stationInfo: { name: stationName } },
        { balance: wallet },
        schedule
    ]: [{token: string}, users_me_interface, users_home_locations_interface, users_wallet_balances_interface, ScheduleInterface] = useLoaderData()

    return (
        <PageWrapper>
            <ExitHeader text={"버스 예매"} />
            <PageMain>
                <BookingSchedule schedule={schedule} borderingPoint={schedule.direction === 'TO_HOME' ? schoolName : stationName}/>
                <Divider />
                <PricingInfo count={schedule.timeSchedule.length} wallet={wallet} />
                <Divider />
                <PaymentMethod />
                <RefundPolicy />
                <ActionButton token={token} schedule={schedule} wallet={wallet}/>
            </PageMain>
        </PageWrapper>
    )
}