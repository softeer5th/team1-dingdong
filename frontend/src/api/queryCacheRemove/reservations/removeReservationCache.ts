import {queryClient} from "@/main.tsx";


export default function removeReservationCache(type: 'ALL' | 'ALLOCATED' | 'PENDING' | 'FAIL_ALLOCATED' | 'ENDED' | 'CANCELED' | 'HOME') {
    queryClient.removeQueries({
        predicate: (query) =>
            Array.isArray(query.queryKey) && // queryKey가 배열인지 확인
            query.queryKey[0] === "/api/users/reservations" &&
            query.queryKey[1]?.category === type
    })
}