import {axiosInstance} from "@/api";
import {queryClient} from "@/main.tsx";
import {users_timetable_interface} from "@/api/query/users";

export async function putTimetable(body: users_timetable_interface) {
    const response = await axiosInstance.put('/api/users/timetable', body)
    await queryClient.invalidateQueries({
        queryKey: "/api/users/timetable"
    })
    return response.data
}