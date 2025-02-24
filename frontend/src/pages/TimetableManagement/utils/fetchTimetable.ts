import {users_timetable_interface} from "@/api/query/users";
import {putTimetable} from "@/api/timetable/putTimetable.ts";
import {queryClient} from "@/main.tsx";
import {isAxiosError} from "axios";

export const fetchTimetable = async (timetable: users_timetable_interface, addToast: (message: string) => void) => {
    // 등교 하교 시간 검증. 등교 < 하교
    const timeArray = Object.values(timetable) as (keyof users_timetable_interface)[]
    for (let i = 0; i < 10; i += 2) {
        const time1 = parseInt((timeArray[i] ?? '00:00').split(':').join(), 10)
        const time2 = parseInt((timeArray[i + 1] ?? '00:00').split(':').join(), 10)

        if ((time1 > time2) && timeArray[i] && timeArray[i + 1]) {
            addToast("하교 시간은 등교 시간 이후여야 합니다.")
            return
        }
    }

    try {
        await putTimetable(timetable)
        addToast("시간표가 성공적으로 저장되었습니다.")

        // 클라이언트에서 직접 수정
        queryClient.setQueryData<users_timetable_interface>(
            ["/api/users/timetable"],
            (oldData) => {
                if (oldData == null) return oldData;
                return timetable
            }
        )
    }
    catch (error) {
        if (isAxiosError(error) && error.response) {
            const { status } = error.response;

            if (status === 400) {
                return addToast("하교 시간은 등교 시간 이후여야 합니다.");
            }

            return addToast("알 수 없는 오류가 발생했습니다."); // 400 이외의 다른 응답 코드
        }

        addToast("네트워크 오류가 발생했습니다."); // AxiosError가 아닐 때 (예: 인터넷 끊김)
    }
}