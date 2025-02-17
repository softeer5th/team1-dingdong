import {PageMain, PageWrapper} from "@/pages/Reservations/styles.ts";
import CardSlider from "@/pages/Reservations/components/CardSlider";
import BookingHistory from "@/pages/Reservations/components/BookingHistory";
import PopHeader from "@/components/Headers/PopHeader";
import {useLoaderData} from "react-router-dom";
import {TO_HOME_ALLOCATED, TO_SCHOOL_ALLOCATED, users_reservations_interface} from "@/api/query/users";


export default function Page() {
    const [allReservations, allocatedReservations, pendingReservations, endedReservations, canceledReservations]: users_reservations_interface[]  = useLoaderData();


    console.log(allocatedReservations.reservationInfos.content)
    return (
        <PageWrapper>
            <PopHeader text={"예매 내역"} />
            <PageMain>
                {/* 여기 슬라이드 구현 */}
                <CardSlider contents={allocatedReservations.reservationInfos.content as Extract< users_reservations_interface['reservationInfos']['content'][number], TO_SCHOOL_ALLOCATED | TO_HOME_ALLOCATED>[]} />
                <BookingHistory
                    allReservations={allReservations}
                    allocatedReservations={allocatedReservations}
                    pendingReservations={pendingReservations}
                    endedReservations={endedReservations}
                    canceledReservations={canceledReservations}/>
            </PageMain>
        </PageWrapper>
    )
}

