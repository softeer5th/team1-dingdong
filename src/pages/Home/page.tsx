// 스타일
import {
    PageWrapper, PageMain
} from "@/pages/Home/styles.ts"
// 컴포넌트
import HomeHeader from "@/components/Headers/HomeHeader";
import BusState from "@/pages/Home/component/BusState";
import HomeSchool from "@/pages/Home/component/HomeSchool";
import BusSelection from "@/pages/Home/component/BusSelection";
import {useLoaderData} from "react-router-dom";
import {
    users_home_locations_interface,
    users_me_interface,
    users_notifications_checkUnread_interface,
    users_reservations_interface
} from "@/api/query/users";
import {useRef} from "react";

export default function Page() {
    const [me, reservations, unreadNotification, home]: [users_me_interface, users_reservations_interface, users_notifications_checkUnread_interface, users_home_locations_interface] = useLoaderData();

    const ref = useRef<HTMLDivElement>(null)

    return (
        <PageWrapper>
            <HomeHeader busStateRef={ref} unreadNotification={unreadNotification}/>
            <PageMain>
                <BusSelection />
                <HomeSchool stationName={home.stationInfo.name} schoolName={me.schoolName}/>
                {/* type 에 따라 예매 내역 유무*/}
                <BusState busStateRef={ref} reservations={reservations.reservationInfos}/>
            </PageMain>
        </PageWrapper>
    );
}