import {mountModal} from "@/components/Loading";
import Modal from "@/components/Modal";
import reload from "@/route/utils/reload.ts";
import preserveNavigate from "@/route/utils/preserveNavigate.ts";

export type networkErrorType =
    400 |
    403 |
    404 |
    500 |
    'network_default'
export const networkErrorHandler: Record<networkErrorType, Function> = {
    400: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["⛔ 400 BadRequest:", " 잘못된 요청입니다."]}
                    text={["잠시 후 다시 시도해 주세요."]}
                    isError={true}
                    leftButton={{
                        text: "새로고침",
                        onClick: () => {
                            unmountModal()
                            reload()
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    },
    403: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["⛔ 403 Forbidden:"," 접근 권한이 없습니다."]}
                    text={["잠시 후 다시 시도해 주세요."]}
                    isError={true}
                    leftButton={{
                        text: "새로고침",
                        onClick: () => {
                            unmountModal()
                            reload()
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    },
    404: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["🔍 404 Not Found:", " 리소스를 찾을 수 없습니다."]}
                    text={["잠시 후 다시 시도해 주세요."]}
                    isError={true}
                    leftButton={{
                        text: "새로고침",
                        onClick: () => {
                            unmountModal()
                            reload()
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    },
    500: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["🔥 500 Internal Server Error:", " 서버 오류 발생."]}
                    text={["잠시 후 다시 시도해 주세요."]}
                    isError={true}
                    leftButton={{
                        text: "새로고침",
                        onClick: () => {
                            unmountModal()
                            reload()
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    },
    network_default: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["⚠️ 알 수 없는 오류가 발생했습니다."]}
                    text={["잠시 후 다시 시도해 주세요."]}
                    isError={true}
                    leftButton={{
                        text: "새로고침",
                        onClick: () => {
                            unmountModal()
                            reload()
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    }
}