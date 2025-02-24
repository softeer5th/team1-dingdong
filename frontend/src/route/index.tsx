import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/layout.tsx";
import dataStrategy from "@/route/dataStrategy.tsx";
import ErrorPage from "@/pages/Error/page.tsx";
import {INIT_WALLET_PAGE_SIZE, INIT_WALLET_PAGE} from "@/env.ts";

export const router = createBrowserRouter(
  [
    {
        path: "/",
        Component: Layout,
        errorElement: <></>,
        loader: () => null,
        shouldRevalidate: () => true,
        children: [
            {
                index: true,
                lazy: async () => {
                    const [{ default: LoginHomeScreen }] = await Promise.all([
                        import("@/pages/Auth/LoginHome/index.tsx"),
                    ]);
                    return { Component: LoginHomeScreen };
                },
            },
            {
                path: "login",
                lazy: async () => {
                    const [{ default: Login }] = await Promise.all([
                        import("@/pages/Auth/Login/index.tsx"),
                    ]);
                    return { Component: Login };
                },
            },
            {
                path: "/signup",
                lazy: async () => {
                    const [{ default: SignupLayout }] = await Promise.all([
                        import("@/pages/Auth/Signup/page"),
                    ]);
                    return { Component: SignupLayout };
                },
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            const [{default: SchoolAuthSignUp}, {createLoader}] = await Promise.all([
                                import("@/pages/Auth/Signup/SchoolAuth/index.tsx"),
                                import("@/route/loader/createLoader.tsx"),
                            ]);
                            const schoolModule = await import('@/api/query/signUp/index.ts')
                            return {
                                Component: SchoolAuthSignUp,
                                loader: createLoader(() => [schoolModule.school()])
                            };
                        },
                    },
                    {
                        path: "password",
                        lazy: async () => {
                            const [{default: PasswordSignup}] = await Promise.all([
                                import("@/pages/Auth/Signup/Password/index.tsx"),
                            ]);
                            return {
                                Component: PasswordSignup,
                            };
                        },
                    },
                    {
                        path: "user-info",
                        lazy: async () => {
                            const [{default: UserInfoSignup}] = await Promise.all([
                                import("@/pages/Auth/Signup/UserInfo/index.tsx"),
                            ]);
                            return {
                                Component: UserInfoSignup,
                            };
                        },
                    },
                ],
            },
            {
                path: "",
                lazy: async () => {
                    const [{default: SocketLayout}] = await Promise.all([
                        import("@/pages/SocketLayout/layout.tsx")
                    ])
                    return { Component: SocketLayout }
                },
                children: [
                    {
                        path: "home",
                        lazy: async () => {
                            const [{ default: Home }, { default: HomeLoader }] = await Promise.all([
                                import("@/pages/Home/page.tsx"),
                                import("@/route/loader/home/loader.tsx"),
                            ]);
                            return {
                                Component: Home,
                                loader: HomeLoader
                            };
                        },
                    },
                    {
                        path: "notification",
                        lazy: async () => {
                            const [{ default: Notification }, {createLoader}] = await Promise.all([
                                import("@/pages/Notification/page.tsx"),
                                import("@/route/loader/createLoader.tsx")
                            ]);
                            const notificationLoader = await import('@/api/query/notification')
                            return {
                                Component: Notification,
                                loader: createLoader(() => [
                                    notificationLoader.notifications({
                                        page: 0,
                                        pageSize: 10,
                                    }),
                                ]),
                            };
                        },
                    },
                    {
                        path: "set-home-location",
                        lazy: async () => {
                            const [{ default: SetHomeLocation }, { createLoader }] =
                                await Promise.all([
                                    import("@/pages/SetHomeLocation/page.tsx"),
                                    import("@/route/loader/createLoader.tsx"),
                                ]);
                            const usersModule = await import("@/api/query/users");
                            return {
                                Component: SetHomeLocation,
                                loader: createLoader(() => [usersModule.users_home_locations()]
                                ),
                            };
                        },
                    },
                    {
                        // 버스 예매하기
                        path: "custom-bus-booking",
                        lazy: async () => {
                            const [{ default: CustomRouteBooking }, { createLoader }] = await Promise.all([
                                import("@/pages/BusBooking/CustomRouteBooking/page.tsx"),
                                import("@/route/loader/createLoader.tsx"),
                            ]);
                            const usersModule = await import("@/api/query/users");
                            return {
                                Component: CustomRouteBooking,
                                loader: createLoader(() => [
                                    usersModule.users_me(),
                                    usersModule.users_home_locations(),
                                ]),
                            };
                        },
                    },
                    {
                        // 함께 타기 버스 선택하기
                        path: "fixed-bus-select-bus",
                        lazy: async () => {
                            const [
                                { default: FixedRouteBookingSelectBus },
                                { fixedRouteBookingLoader },
                            ] = await Promise.all([
                                import("@/pages/BusBooking/FixedRouteBookingSelectBus/page.tsx"),
                                import(
                                    "@/route/loader/fixedRouteBooking/fixedRouteBookingLoader"
                                    ),
                            ]);
                            return {
                                Component: FixedRouteBookingSelectBus,
                                loader: fixedRouteBookingLoader,
                            };
                        },
                    },
                    {
                        // 함께 타기 예매하기
                        path: "fixed-bus-booking",
                        lazy: async () => {
                            const [{ default: FixedRouteBooking }, { createLoader }] = await Promise.all([
                                import("@/pages/BusBooking/FixedRouteBooking/page.tsx"),
                                import("@/route/loader/createLoader.tsx"),
                            ]);
                            const usersModule = await import("@/api/query/users");
                            return {
                                Component: FixedRouteBooking,
                                loader: createLoader(() => [
                                    usersModule.users_me(),
                                    usersModule.users_home_locations(),
                                ]),
                            };
                        },
                    },
                    {
                        path: "bus-tracker",
                        lazy: async () => {
                            const [{ default: BusTrackerPage }, { default: busTrackerLoader }] =
                                await Promise.all([
                                    import("@/pages/BusTracker/page.tsx"),
                                    import("@/route/loader/bus-tracker/loader.tsx"),
                                ]);
                            return { Component: BusTrackerPage, loader: busTrackerLoader };
                        },
                    },
                    {
                        path: "reservations",
                        lazy: async () => {
                            const [{ default: ReservationsPage }, { default: ReservationsLoader }] =
                                await Promise.all([
                                    import("@/pages/Reservations/page.tsx"),
                                    import("@/route/loader/reservations/loader.tsx"),
                                ]);
                            return {
                                Component: ReservationsPage,
                                loader: ReservationsLoader,
                            };
                        },
                    },
                    {
                        path: "payment",
                        children: [
                            {
                                path: "reservation",
                                lazy: async () => {
                                    const [
                                        { default: PaymentReservationPage },
                                        { default: paymentReservationLoader },
                                    ] = await Promise.all([
                                        import("@/pages/Payment/Reservation/page.tsx"),
                                        import("@/route/loader/payment/reservation/loader.tsx"),
                                    ]);
                                    return {
                                        Component: PaymentReservationPage,
                                        loader: paymentReservationLoader,
                                    };
                                },
                            },
                            {
                                path: "purchase",
                                lazy: async () => {
                                    const [
                                        { default: PaymentPurchasePage },
                                        { default: paymentPurchaseLoader },
                                    ] = await Promise.all([
                                        import("@/pages/Payment/Purchase/page.tsx"),
                                        import("@/route/loader/payment/purchase/loader.tsx"),
                                    ]);
                                    return {
                                        Component: PaymentPurchasePage,
                                        loader: paymentPurchaseLoader,
                                    };
                                },
                            },
                            {
                                path: "success",
                                lazy: async () => {
                                    const [
                                        { default: PaymentSuccessPage }
                                    ] = await Promise.all([
                                        import("@/pages/Payment/Success/page.tsx"),
                                    ])
                                    return {
                                        Component: PaymentSuccessPage
                                    }
                                }
                            }
                        ],
                    },
                    {
                        path: "my-page",
                        lazy: async () => {
                            const [{ default: MyPage }, { createLoader: createLoader }] =
                                await Promise.all([
                                    import("@/pages/MyPage/page.tsx"),
                                    import("@/route/loader/createLoader.tsx"),
                                ]);
                            const usersModule = await import("@/api/query/users");
                            return { Component: MyPage, loader: createLoader(()=> [
                                    usersModule.users_me()
                                ]) };
                        },
                    },
                    {
                        // 시간표 관리 페이지
                        path: "timetable-management",
                        lazy: async () => {
                            const [{ default: TimetableManagementPage }, { createLoader: createLoader }] =
                                await Promise.all([
                                    import("@/pages/TimetableManagement/page.tsx"),
                                    import("@/route/loader/createLoader.tsx"),
                                ]);
                            const usersModule = await import("@/api/query/users");
                            return { Component: TimetableManagementPage, loader: createLoader(()=> [
                                    usersModule.users_timetable()
                                ]) };
                        },
                    },
                    {
                        // 충전 페이지
                        path: "wallet",
                        lazy: async () => {
                            const [{ default: Wallet }, { createLoader: createLoader }] =
                                await Promise.all([
                                    import("@/pages/Wallet/page.tsx"),
                                    import("@/route/loader/createLoader.tsx"),
                                ]);
                            const usersModule = await import("@/api/query/users");
                            return { Component: Wallet, loader: createLoader(()=> [
                                    usersModule.users_wallet_history({page: INIT_WALLET_PAGE, pageSize: INIT_WALLET_PAGE_SIZE})
                                ]) };
                        },
                    },
                ]
            },
        ],
    },
    {
      path: "*",
      Component: ErrorPage,
    },
  ],
  {
    dataStrategy,
  }
);
