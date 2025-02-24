import {axiosInstance} from "@/api";
import {users_reservations_interface} from "@/api/query/users";

interface ReservationInfo {
    reservationInfo: users_reservations_interface['reservationInfos']['content'][number]
}
export async function getReservationById(id: number) {
    const response = await axiosInstance.get<ReservationInfo>(`/api/users/reservations/${id}`)
    return response.data
}