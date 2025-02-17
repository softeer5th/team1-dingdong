import {createBrowserRouter} from "react-router-dom";
import Layout from "@/pages/layout.tsx";
import dataStrategy from "@/route/dataStrategy.tsx";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            Component: Layout,
            errorElement: <></>,
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
                    path: "home",
                    lazy: async () => {
                        const [{ default: Home }, { createLoader }] = await Promise.all([
                            import("@/pages/Home/page.tsx"),
                            import("@/route/loader/createLoader.tsx"),
                        ]);
                        const usersModule = await import("@/api/query/users");
                        return {
                            Component: Home,
                            loader: createLoader(() => {

                                return [
                                    usersModule.users_me(),
                                    usersModule.users_reservations({
                                        page: 0,
                                        pageSize: 5,
                                        category: "HOME",
                                        sort: "LATEST",
                                    }),
                                    usersModule.users_notifications_checkUnread(),
                                    usersModule.users_home_locations(),
                                ];
                            })

                        };
                    },
                },
                {
                    path: "notification",
                    lazy: async () => {
                        const [{ default: Notification }] = await Promise.all([
                            import("@/pages/Notification/page.tsx"),
                        ]);
                        return { Component: Notification };
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
                        const [{ default: FixedRouteBookingSelectBus }, { createLoader }] = await Promise.all([
                            import("@/pages/BusBooking/FixedRouteBookingSelectBus/page.tsx"),
                            import("@/route/loader/createLoader.tsx"),
                        ]);
                        const usersModule = await import("@/api/query/users");
                        return {
                            Component: FixedRouteBookingSelectBus,
                            loader: createLoader(() => [
                                usersModule.users_me(),
                                usersModule.users_home_locations(),
                            ]),
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
                        const [{ default: ReservationsPage }, { createLoader }] =
                            await Promise.all([
                                import("@/pages/Reservations/page.tsx"),
                                import("@/route/loader/createLoader.tsx"),
                            ]);
                        const usersModule = await import("@/api/query/users");
                        return {
                            Component: ReservationsPage,
                            loader: createLoader(() => [
                                usersModule.users_reservations({
                                    page: 0,
                                    pageSize: 10,
                                    category: "ALL",
                                    sort: "LATEST",
                                }),
                                usersModule.users_reservations({
                                    page: 0,
                                    category: "ALLOCATED",
                                    sort: "OLDEST",
                                }),
                                usersModule.users_reservations({
                                    page: 0,
                                    pageSize: 10,
                                    category: "PENDING",
                                    sort: "OLDEST",
                                }),
                                usersModule.users_reservations({
                                    page: 0,
                                    pageSize: 10,
                                    category: "ENDED",
                                    sort: "OLDEST",
                                }),
                                usersModule.users_reservations({
                                    page: 0,
                                    pageSize: 10,
                                    category: "CANCELED",
                                    sort: "OLDEST",
                                }),
                            ]),
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
                    ],
                },
            ],
        },
    ],
    {
        dataStrategy,
    }
);