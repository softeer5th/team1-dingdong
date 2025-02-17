import {LoaderFunctionArgs} from "react-router-dom";
import {queryClient} from "@/main.tsx";
import {axiosInstance} from "@/api";
import handleError from "@/route/loader/handleError.ts";


export default async function loader({ request, params }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    if (params) {}

    const busScheduleId = queryParams.get('busScheduleId')

    try {
        // 서버 요청 실행
        return await Promise.all([
            queryClient.fetchQuery({
                queryKey: [`/api/bus/path${busScheduleId}`],
                queryFn: async () => {
                    const response = await axiosInstance.get(`/api/bus/path/${busScheduleId}`)
                    return response.data;
                },
                staleTime: 1000 * 60, // 1분 동안 캐싱
            }),
            queryClient.fetchQuery({
                queryKey: [`/api/bus/bus-stop/location${busScheduleId}`],
                queryFn: async () => {
                    const response = await axiosInstance.get(`/api/bus/bus-stop/location/${busScheduleId}`)
                    return response.data;
                },
                staleTime: 1000 * 60, // 1분 동안 캐싱
            }),
        ]);
    } catch (error) {
        handleError(error);
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