import PopHeader from "@/components/Headers/PopHeader";
import {
    ItemButton, ItemDivde, ItemTitle,
    ItemWrapper,
    Main,
    PageWrapper,
    UserEmail,
    UserInfo,
    UserName,
    UserProfile,
    UserProfileBox
} from "@/pages/MyPage/styles.ts";
import {useLoaderData, useNavigate} from "react-router-dom";
import ArrowRightIcon from "@/components/designSystem/Icons/MyPage/ArrowRightIcon.tsx";
import {users_me_interface} from "@/api/query/users";


export default function Page() {
    const navigate = useNavigate();
    const [user]: [users_me_interface] = useLoaderData()


    return (
        <PageWrapper>
            <PopHeader text={"마이 페이지"} />
            <Main>
                <UserProfileBox>
                    <UserProfile>
                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <g clip-path="url(#clip0_1175_15874)">
                                <path d="M21.9996 25.3C25.6447 25.3 28.5996 22.3451 28.5996 18.7C28.5996 15.0549 25.6447 12.1 21.9996 12.1C18.3545 12.1 15.3996 15.0549 15.3996 18.7C15.3996 22.3451 18.3545 25.3 21.9996 25.3Z" fill="#C3C3CF"/>
                                <path d="M6.59961 45.1C6.59961 36.5948 13.4944 29.7 21.9996 29.7C30.5048 29.7 37.3996 36.5948 37.3996 45.1H6.59961Z" fill="#C3C3CF"/>
                            </g>
                            <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#DDDDE5"/>
                            <defs>
                                <clipPath id="clip0_1175_15874">
                                    <rect width="44" height="44" rx="22" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </UserProfile>
                    <UserInfo>
                        <UserName>
                            {user.userName}
                        </UserName>
                        <UserEmail>
                            {user.email}
                        </UserEmail>
                    </UserInfo>
                </UserProfileBox>
                <ul>
                    <Item text={'예매 내역'} onClick={() => navigate('/reservations')}/>
                    <Item text={'딩동 머니 충전'} onClick={() => navigate('/wallet')}/>
                    <Item text={'시간표 관리'} onClick={() => navigate('/timetable-management')}/>
                    <ItemDivde />
                    <Item text={'비밀번호 재설정'}/>
                    <Item text={'알림 설정'}/>
                    <ItemDivde />
                    <Item text={'안내 사항'}/>
                    <Item text={'고객 센터'}/>
                    <Item text={'FAQ'}/>
                </ul>
            </Main>
        </PageWrapper>
    )
}


interface ItemProps {
    text: string;
    onClick?: () => void;
}
function Item({text, onClick = () => {}}: ItemProps) {

    return (
        <ItemWrapper>
            <ItemTitle>{text}</ItemTitle>
            <ItemButton onClick={onClick}>
                <ArrowRightIcon />
            </ItemButton>
        </ItemWrapper>
    )
}