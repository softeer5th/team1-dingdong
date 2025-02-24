import {axiosInstance} from "@/api";

interface Notifications {
    notifications: {
        "content": [
            {
                type : "ALLOCATION_SUCCESS" | "ALLOCATION_FAILED" | "BUS_START"
                timestamp : string
                money : number
                reservationInfo: {
                    reservationId: number
                    startStationName: string
                    endStationName: string
                    startDate: string
                    expectedStartTime: string
                    expectedEndTime : string
                },
                read: boolean
            },
        ],
        page: {
            size: number
            number: number
            totalElements: number
            totalPages: number
        }
    }
}

export async function getLatestNotification() {
    const response = await axiosInstance.get<Notifications>('/api/users/notifications?page=0&pageSize=1')
    const type = response.data.notifications.content[0].type;

    return type
}