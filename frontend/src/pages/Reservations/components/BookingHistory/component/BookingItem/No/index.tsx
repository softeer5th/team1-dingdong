import {NoItemText, NoItemWrapper} from "@/pages/Reservations/components/BookingHistory/styles.ts";

export default function NoItem() {
    return (
        <NoItemWrapper>
            <NoItemText>
                내역이 없어요.
            </NoItemText>
        </NoItemWrapper>
    )
}