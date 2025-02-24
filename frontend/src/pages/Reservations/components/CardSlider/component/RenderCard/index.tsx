import {PREV, CURRENT, NEXT} from "@/pages/Reservations/components/CardSlider";
import {users_reservations_interface} from "@/api/query/users";
import {MutableRefObject, ReactNode} from "react";
import Card from "@/pages/Reservations/components/CardSlider/component/Card";
import NullCard from "@/pages/Reservations/components/CardSlider/component/NullCard";

interface RenderCardsProps {
    contentsLength: number
    slideCurrent: MutableRefObject<number>,
    slideState: { isNext: boolean } | null,
    countRef: MutableRefObject<number[]>,
    data: {
        direction: users_reservations_interface['reservationInfos']['content'][number]['direction'];
        date: string,
        location: string,
        time: string
    }[]
}
export default function RenderCards({contentsLength, slideCurrent, slideState, countRef, data}: RenderCardsProps) {
    const prev = slideCurrent.current > 0 ? slideCurrent.current - 1 : data.length - 1;
    const current = slideCurrent.current
    const next = slideCurrent.current < data.length - 1 ? slideCurrent.current + 1 : 0;

    const renderHandler: Record<typeof PREV | typeof CURRENT | typeof NEXT, (index: number) => ReactNode> = {
        [PREV]: (index: number) => (
            <Card
                key={index}
                isHidden={!slideState?.isNext}
                count={PREV}
                toUniversity={data[current].direction === "TO_SCHOOL"}
                date={data[prev].date}
                location={data[prev].location}
                time={data[prev].time}
            />
        ),
        [CURRENT]: (index: number) => (
            <Card
                key={index}
                count={CURRENT}
                toUniversity={data[current].direction === "TO_SCHOOL"}
                date={data[current].date}
                location={data[current].location}
                time={data[current].time}
            />
        ),
        [NEXT]: (index: number) => (
            <Card
                key={index}
                isHidden={!!slideState?.isNext}
                count={NEXT}
                toUniversity={data[current].direction === "TO_SCHOOL"}
                date={data[next].date}
                location={data[next].location}
                time={data[next].time}
            />
        ),
    };



    return (
        <>
            {
                contentsLength === 0 ?
                    <NullCard /> :
                    countRef.current.map((count, index) => {
                        if (count === PREV || count === NEXT || count === CURRENT) {
                            return renderHandler[count](index);
                        }
                    })
            }
        </>
    )
}

