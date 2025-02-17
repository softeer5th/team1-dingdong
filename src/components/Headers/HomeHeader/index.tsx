import BellIcon from "@/components/designSystem/Icons/Home/BellIcon";
import UserIcon from "@/components/designSystem/Icons/Home/UserIcon";
import {NavButton, NavList, Title, Wrapper} from "@/components/Headers/HomeHeader/styles.ts";
import {users_notifications_checkUnread_interface} from "@/api/query/users";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSocket} from "@/hooks/useSocket";
import {colors} from "@/styles/colors.ts";

interface HomeHeaderProps {
    busStateRef: React.RefObject<HTMLDivElement>;
    unreadNotification: users_notifications_checkUnread_interface
}
export default function HomeHeader({busStateRef, unreadNotification}: HomeHeaderProps) {
    const [isNotification, setIsNotification] = useState<[boolean]>([unreadNotification.hasUnreadNotifications]);
    const navigate = useNavigate()
    const ws = useSocket()
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerColor, setHeaderColor] = useState<string>(colors.gray20)

    // 알림 구독
    useEffect(() => {
        if (ws instanceof WebSocket) {
            const handleMessage = (message: MessageEvent) => {
                const data = JSON.parse(message.data);
                if (data === 'alarm') {
                    setIsNotification([true]);
                }
            };

            ws.addEventListener("message", handleMessage);

            return () => {
                ws.removeEventListener("message", handleMessage); // 언마운트 시 이벤트 리스너 삭제
            };
        }
    }, [ws]); // `ws`가 변경될 때마다 실행

    useEffect(() => {
        const handleScroll = () => {
            if (!headerRef.current || !busStateRef.current) return;

            const headerRect = headerRef.current.getBoundingClientRect();
            const busStateRect = busStateRef.current.getBoundingClientRect();

            // ✅ A의 bottom이 B의 top보다 크고, A의 top이 B의 bottom보다 작으면 겹침
            if (headerRect.bottom >= busStateRect.top && headerRect.top <= busStateRect.bottom) {
                setHeaderColor(colors.gray0); // 겹치는 경우
            } else {
                setHeaderColor(colors.gray20); // 안 겹치는 경우
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    return (

        <Wrapper ref={headerRef} backgroundColor={headerColor}>
            <Title>
                DingDong
            </Title>
            <NavList>
                <li>
                    <NavButton
                        isNotification={isNotification[0]}
                        onClick={() => navigate('/notification')}>
                        <BellIcon />
                    </NavButton>
                </li>
                <li>
                    <NavButton
                        onClick={() => navigate('/my-page')}>
                        <UserIcon />
                    </NavButton>
                </li>
            </NavList>
        </Wrapper>
    )
}