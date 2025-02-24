import {LoaderFunctionArgs} from "react-router-dom";
import {queryClient} from "@/main.tsx";
import {axiosInstance} from "@/api";
import handleError from "@/route/loader/handleError.ts";
import {users_me} from "@/api/query/users";


export default async function loader({ request, params }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    if (params) {
    }

    const busScheduleId = queryParams.get('busScheduleId')

    try {
        // 서버 요청 실행
        return await Promise.all([
            queryClient.ensureQueryData({
                queryKey: [`/api/bus/path${busScheduleId}`],
                queryFn: async () => {
                    const response = await axiosInstance.get(`/api/bus/path/${busScheduleId}`)
                    return response.data;
                },
                staleTime: 1000 * 60, // 1분 동안 캐싱
            }),
            queryClient.ensureQueryData({
                queryKey: [`/api/bus/bus-stop/location${busScheduleId}`],
                queryFn: async () => {
                    const response = await axiosInstance.get(`/api/bus/bus-stop/location/${busScheduleId}`)
                    return response.data;
                },
                staleTime: 1000 * 60, // 1분 동안 캐싱
            }),
            queryClient.fetchQuery({
                queryKey: [`/api/reservations/busSchedules/${busScheduleId}`],
                queryFn: async () => {
                    const response = await axiosInstance.get(`/api/users/reservations/busSchedules/${busScheduleId}`);
                    return response.data;
                },
                staleTime: 0, // 즉시 새로고침
                gcTime: 0, // 캐시 유지 시간 0으로 설정 → 즉시 삭제
            }),
            queryClient.ensureQueryData(users_me())
        ]);
    } catch (error) {
        return handleError(error);
    }
}

export interface bus_path_interface {
    points : {
        longitude: number;
        latitude: number;
    }[]
}

export interface bus_bus_stop_location_interface {
    longitude: number;
    latitude: number;
}