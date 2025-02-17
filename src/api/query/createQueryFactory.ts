
import {axiosInstance} from "@/api";
import {FetchQueryOptions} from "@tanstack/react-query";

// 헬퍼 함수: 엔드포인트 받아 QueryFactory 함수를 생성합니다.
/*
<T, Error, T>
TQueryFnData: queryFn이 반환하는 데이터의 타입
TError: 발생할 수 있는 에러의 타입
TData: 최종적으로 변환된 데이터의 타입
 */
export function createQueryFactory<T>(endpoint: string, needCache: boolean = true): (queryParams?: {}) => FetchQueryOptions<T, Error, T> {
    return (queryParams = {}):FetchQueryOptions<T, Error, T> => ({
        // 쿼리 파라미터가 존재하면 [endpoint, queryParams]를, 없으면 [endpoint]를 캐시 키로 사용
        queryKey: Object.keys(queryParams).length > 0 ? [endpoint, queryParams] : [endpoint],
        queryFn: async () => {
            const queryString = new URLSearchParams(queryParams).toString();
            const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
            const response = await axiosInstance.get(url);
            return response.data;
        },
        staleTime: needCache ? 1000 * 60 * 60 : 0
    });
}