import {FetchQueryOptions} from "@tanstack/react-query";
import {LoaderFunctionArgs} from "react-router-dom";
import {AxiosResponse} from "axios";
import Modal from "@/components/Modal";
import {queryClient} from "@/main.tsx";
import {ReactNode} from "react";
import handleError from "@/route/loader/handleError.ts";

type CallbackF = () => FetchQueryOptions<any, Error, any>[];
type CallbackF2 = () => (() => Promise<AxiosResponse<any, any>>)[];

/**
 * 특정 HTTP 에러 상태에 대한 모달을 렌더링하는 함수
 */
export function handleErrorModal(render: (component: ReactNode) => void, message: string[]) {
    render(
        <Modal
            title={message}
            text={["잠시 후 다시 시도해 주세요."]}
            isError={true}
            leftButton={{
                text: "새로고침",
                onClick: () => {
                    window.location.reload();
                },
            }}
        />
    );
}

/**
 * React Query Loader 생성 함수
 *
 * @param callbackF - React Query 객체 배열 반환 함수
 * @param callbackF2 - Axios 요청을 포함한 async 함수 배열 반환 함수 (옵션)
 */
export function createLoader(callbackF: CallbackF, callbackF2?: CallbackF2) {
    return async function loader({ request, params }: LoaderFunctionArgs) {

        // ts 방지용 (미사용 변수 처리)
        if (request || params) {}

        const queries = callbackF();
        const fetches = (callbackF2 ?? (() => []))(); // 기본값을 `() => []`로 설정

        // 실행할 로드 함수가 없으면
        if (queries.length === 0 && fetches.length === 0) {
            return null;
        }


        try {
            // 서버 요청 실행
            return await Promise.all([
                ...queries.map((query) => queryClient.fetchQuery({...query})),
                ...fetches.map((fn) => fn()), // 여기서 fetches를 실행
            ]);
        } catch (error) {
            handleError(error);
        }
    };
}