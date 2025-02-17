import {DataStrategyFunctionArgs, DataStrategyMatch, DataStrategyResult} from "react-router-dom";
import middleware from "@/route/middleware.tsx";
import LoadingModal, {mountModal} from "@/components/Loading";
import {CustomError, executeErrorHandler} from "@/route/error";

export default async function dataStrategy(
    { request, matches }: DataStrategyFunctionArgs
): Promise<Record<string, DataStrategyResult>> {

    const {render, unmountModal} = mountModal()
    const timeout = setTimeout(() => {
        render(<LoadingModal text={"페이지 불러오는 중"} />);
    }, 1000); // 1초(1000ms) 뒤에 실행


    // 중앙 에러 처리. middleware + loader
    try {
        // middleware 실행
        await middleware(request)

        // loader 실행
        const results = await executeLoaders(matches);
        clearTimeout(timeout)
        unmountModal()
        return results;
    }
    catch (error) {
        clearTimeout(timeout)
        unmountModal()
        // 커스텀 에러
        if (error instanceof CustomError) {
            executeErrorHandler(error.errorType, request)
        }
        // 알 수 없는 제어. 제어 못한 에러
        else {

        }

        return {
            default: {
                type: 'error',
                result: null
            }
        }
    }

}


async function executeLoaders(matches:  DataStrategyMatch[]) {
    // load 가능한 loader로 filter
    const matchesToLoad = matches.filter(
        (m) => m.shouldLoad
    );

    const results = await Promise.all(
        matchesToLoad.map(async (match) => {
            console.log(`Processing ${match.route.id}`);
            // Don't override anything - just resolve route.lazy + call loader
            const result = await match.resolve();

            // 커스텀 에러 발생
            if (result.result instanceof CustomError) {
                // 그대로 던지기
                throw result.result
            }
            // 정상 데이터
            else {
                return result;
            }
        })
    );

    return results.reduce(
        (acc, result, i) =>
            Object.assign(acc, {
                [matchesToLoad[i].route.id]: result,
            }),
        {}
    );
}

