import {users_reservations_interface} from "@/api/query/users";
import {useRevalidator} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {axiosInstance} from "@/api";
import {
    DateText,
    HistoryItem,
    InfoBox, Status, StatusInfo, TripDivide,
    TripInfo,
    TripText
} from "@/pages/Reservations/components/BookingHistory/styles.ts";
import BookingActionButton from "../../BookingActionButton";
import {FILTER_TEXT_LIST} from "@/pages/Reservations/components/BookingHistory";
import {getKstDay} from "@/utils/time/getKstDay.ts";
import {getKstTime} from "@/utils/time/getKstTime.ts";

interface NotAllocatedItemProps {
    TO_HOME?: {
        boardingDate: string;
        boardingPoint: string;
    },
    TO_SCHOOL?: {
        dropOffPoint: string;
        dropOffDate: string;
    }
    status: users_reservations_interface['reservationInfos']['content'][number]['reservationStatus']
    reservationId: number;
    deleteItem: (deletedReservationId: number) => void;
}
export default function NotAllocatedItem({TO_HOME, TO_SCHOOL, reservationId, deleteItem, status}: NotAllocatedItemProps) {
    const { revalidate } = useRevalidator()

    const deleteReservation = useMutation<void, Error, number>({
        mutationFn: (reservationId: number) => {
            return axiosInstance.delete(`/api/users/reservations/${reservationId}`);
        },
        onSuccess: async () => {
            deleteItem(reservationId)
            await revalidate()
        },
        onError: error => {
            console.error('삭제 에러', error)
        }
    });



    return (
        <HistoryItem>
            <InfoBox>
                <DateText>
                    {
                        TO_HOME != null ?
                            getKstDay(TO_HOME.boardingDate) : null
                    }
                    {
                        TO_SCHOOL != null ?
                            getKstDay(TO_SCHOOL.dropOffDate) : null
                    }
                </DateText>
                <TripInfo>
                    <TripText>
                        {
                            // 하교 (학교)
                            TO_HOME != null ?
                                `${TO_HOME.boardingPoint} ${getKstTime(TO_HOME.boardingDate)} 탑승` : null
                        }
                        {
                            // 등교 (집)
                            TO_SCHOOL != null ?
                                `${TO_SCHOOL.dropOffPoint} 탑승` : null
                        }
                    </TripText>
                    <TripDivide/>
                    <TripText>
                        {
                            // 하교 (집)
                            TO_HOME != null ?
                                `집 도착` : null
                        }
                        {
                            // 등교 (학교)
                            TO_SCHOOL != null ?
                                `학교 ${getKstTime(TO_SCHOOL.dropOffDate)} 도착` : null
                        }
                    </TripText>
                </TripInfo>
                <StatusInfo>
                    <Status>
                        {FILTER_TEXT_LIST[status]}
                    </Status>
                </StatusInfo>
            </InfoBox>
            <BookingActionButton disabled={status !== 'PENDING'} onClick={() => {
                if (status === 'PENDING') {
                    deleteReservation.mutate(reservationId)
                }
            }}/>
        </HistoryItem>
    )
}