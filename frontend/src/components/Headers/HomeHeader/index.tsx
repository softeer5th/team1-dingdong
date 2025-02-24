import BellIcon from "@/components/designSystem/Icons/Home/BellIcon";
import UserIcon from "@/components/designSystem/Icons/Home/UserIcon";
import {NavButton, NavList, Title, Wrapper} from "@/components/Headers/HomeHeader/styles.ts";
import {users_notifications_checkUnread_interface} from "@/api/query/users";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {colors} from "@/styles/colors.ts";
import {useNotification} from "@/components/Headers/HomeHeader/hook/useNotification";

interface HomeHeaderProps {
    busStateRef: React.RefObject<HTMLDivElement>;
    unreadNotification: users_notifications_checkUnread_interface
}
export default function HomeHeader({busStateRef, unreadNotification}: HomeHeaderProps) {
    const navigate = useNavigate()
    const isNotification = useNotification(unreadNotification.hasUnreadNotifications)
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerColor, setHeaderColor] = useState<string>(colors.gray20)


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
                        isNotification={isNotification}
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