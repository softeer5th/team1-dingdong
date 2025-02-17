import {mountModal} from "@/components/Loading";
import Modal from "@/components/Modal";
import navigateTo from "@/route/utils/navigateTo.ts";
import preserveNavigate from "@/route/utils/preserveNavigate.ts";
import reload from "@/route/utils/reload.ts";

export type middlewareErrorType =
    1000     // 로그인 X
    | 1001   // 잘못된 접근 (결제 페이지 - 예매)
    | 1002   // 잘못된 접근 (결제 페이지 - 함께타기)
    | 1003   // 잘못된 접근 (함께 타기 - 버스 선택)
    | 1004   // 서버 응답이 없음
    | 1005   // 네트워크 에러 (default)
    | 1006   // 로그인 O
export const middlewareErrorHandler: Record<middlewareErrorType, Function> = {
    1000: (request: Request) => {
        const pathname = new URL(request.url).pathname;

        // 로그인 안했으면, 해당 페이지 제외 접근 불가
        if (!(pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('signup'))) {
            requestAnimationFrame(() => {
                const {render, unmountModal} = mountModal()
                render(
                    <Modal
                        title={["로그인이 필요한 서비스"]}
                        text={["로그인 페이지로 이동하겠습니다."]}
                        isError={true}
                        leftButton={{
                            text: "확인",
                            onClick: () => {
                                unmountModal()
                                navigateTo('/')
                            },
                        }}
                    />
                );
            })
            preserveNavigate(request)
        }
    },
    1006: (request: Request) => {
        const pathname = new URL(request.url).pathname;

        // 로그인 했으면, 해당 페이지 접근 불가
        if (pathname.startsWith('/login') || pathname.startsWith('signup')) {
            navigateTo('/home')
        }
    },
    1001: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["예매할 버스를 선택해주세요"]}
                    text={["결제를 진행하려면 먼저 원하는 버스를 선택해야 합니다."]}
                    isError={true}
                    leftButton={{
                        text: "버스 선택 페이지로 이동",
                        onClick: () => {
                            unmountModal()
                            navigateTo('/fixed-bus-select-bus')
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    },
    1002: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["예매할 버스를 선택해주세요"]}
                    text={["결제를 진행하려면 먼저 원하는 버스를 선택해야 합니다."]}
                    isError={true}
                    leftButton={{
                        text: "버스 선택 페이지로 이동",
                        onClick: () => {
                            unmountModal()
                            navigateTo('/custom-bus-booking')
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    },
    1003: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["탑승 시간을 선택해주세요"]}
                    text={["탑승 시간을 선택하면 이용 가능한 버스 목록을 확인할 수 있습니다."]}
                    isError={true}
                    leftButton={{
                        text: "탑승 시간 선택하러 가기",
                        onClick: () => {
                            unmountModal()
                            navigateTo('/fixed-bus-booking')
                        },
                    }}
                />
            );
        })
        preserveNavigate(request)
    },
    1004: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["서버 응답이 없음"]}
                    text={["서버에서 응답을 받을 수 없습니다."]}
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
    1005: (request: Request) => {
        requestAnimationFrame(() => {
            const {render, unmountModal} = mountModal()
            render(
                <Modal
                    title={["네트워크 문제 또는 API 오류"]}
                    text={["네트워크 문제로 요청을 처리할 수 없습니다."]}
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