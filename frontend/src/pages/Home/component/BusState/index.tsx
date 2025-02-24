// 스타일
import {
    CardList,
    Header,
    HeaderActionSvgBox,
    HeaderInfoText,
    HeaderLeftSection,
    HeaderRightSection,
    HeaderTitle,
    Wrapper
} from "@/pages/Home/component/BusState/styles.ts";
// 컴포넌트
import ArrowRightIcon from "@/components/designSystem/Icons/Home/ArrowRightIcon.tsx";
import {
  users_me_interface,
    users_reservations_interface
} from "@/api/query/users";
import {useNavigate, useRevalidator} from "react-router-dom";
import LoadingCard from "@/pages/Home/component/LoadingCard";
import {getBusCardFunction} from "@/pages/Home/utils/getBusCardFunction.tsx";
import BusReservation from "@/pages/Home/component/BusState/component/BusReservation";
import {getNextBusState} from "@/pages/Home/utils/getNextBusState.ts";
import {RefObject} from "react";


interface BusStateProps {
    reservations: users_reservations_interface['reservationInfos'],
    busStateRef: RefObject<HTMLDivElement>,
    schoolName: users_me_interface['schoolName'],
}

export default function BusState({reservations, busStateRef, schoolName}: BusStateProps) {
    const navigate = useNavigate();
    const { revalidate, state } = useRevalidator()

    return (
        <Wrapper ref={busStateRef}>
            <Header>
                <HeaderLeftSection>
                    <HeaderTitle>
                        예매
                    </HeaderTitle>
                    <HeaderTitle isZero={reservations.page.totalElements === 0}>
                        {reservations.page.totalElements}
                    </HeaderTitle>
                </HeaderLeftSection>
                <HeaderRightSection  onClick={() => {
                    navigate('/reservations');
                }}>
                    <HeaderInfoText>
                        전체보기
                    </HeaderInfoText>
                    <HeaderActionSvgBox>
                        <ArrowRightIcon/>
                    </HeaderActionSvgBox>
                </HeaderRightSection>
            </Header>
            {
                reservations.page.totalElements === 0 ?
                    <BusReservation/> :
                    <CardList>
                        {
                            reservations.content.map((data, key) => {
                                return getBusCardFunction(data.direction, data.reservationStatus)(data, key, schoolName)
                            })
                        }
                        {
                            reservations.page.number < (reservations.page.totalPages - 1) ?
                                <LoadingCard getNextBusState={(errorCallbackF) => getNextBusState(errorCallbackF, reservations, revalidate, state)}/> : null

                        }
                    </CardList>
            }
        </Wrapper>
    );
}

