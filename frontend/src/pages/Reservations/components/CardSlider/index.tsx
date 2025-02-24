import {useEffect, useRef, useState} from "react";
import {ScheduledDepartures} from "./styles.ts";
import {TO_HOME_ALLOCATED, TO_SCHOOL_ALLOCATED, users_reservations_interface} from "@/api/query/users";
import RenderCards from "@/pages/Reservations/components/CardSlider/component/RenderCard";
import Controller from "@/pages/Reservations/components/CardSlider/component/Controller";
import {HiddenCard} from "@/pages/Reservations/components/CardSlider/component/Card";
import {getKstDay} from "@/utils/time/getKstDay.ts";
import {getKstTime} from "@/utils/time/getKstTime.ts";

export const PREV = -1;
export const CURRENT = 0;
export const NEXT = 1;

// @ts-ignore data 때문에 임시로
interface CardSliderProps {
    contents: Extract< users_reservations_interface['reservationInfos']['content'][number], TO_SCHOOL_ALLOCATED | TO_HOME_ALLOCATED>[];
}
export default function CardSlider({contents}: CardSliderProps) {
    const countRef = useRef<number[]>([PREV, CURRENT, NEXT]);
    const slideCurrent = useRef<number>(0);
    const [slideState, setSlideState] = useState<{ isNext: boolean } | null>(null);
    const slideBlock = useRef<boolean>(false);

    useEffect(() => {
        if (slideState !== null) {
            const timer = setTimeout(() => {
                slideBlock.current = false;
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [slideState])

    const slideNext = () => {
        if (slideBlock.current) return;
        slideBlock.current = true;
        slideCurrent.current = slideCurrent.current < contents.length - 1 ? slideCurrent.current + 1 : 0;
        countRef.current.unshift(countRef.current.pop() as number);
        setSlideState({
            isNext: true
        });
    }

    const slidePrev = () => {
        if (slideBlock.current) return;
        slideBlock.current = true;
        slideCurrent.current = slideCurrent.current > 0 ? slideCurrent.current - 1 : contents.length - 1;
        countRef.current.push(countRef.current.shift() as number);
        setSlideState({
            isNext: false
        });
    }




    return (
        <ScheduledDepartures.Wrapper>
            <ScheduledDepartures.Slider>
                <HiddenCard />
                <RenderCards
                    contentsLength={contents.length}
                    slideCurrent={slideCurrent}
                    slideState={slideState}
                    countRef={countRef}
                    data={contents.map(content => ({
                        direction: content.direction,
                        date: content.direction === 'TO_HOME' ? getKstDay(content.operationInfo.busStopArrivalTime, 1) : getKstDay(content.expectedArrivalTime, 1),
                        location: content.busStopName,
                        time: `${content.direction === 'TO_HOME' ? getKstDay(content.expectedDepartureTime) : getKstTime(content.operationInfo.busStopArrivalTime)} 탑승`
                    }))} />
            </ScheduledDepartures.Slider>
            <Controller
                contentsLength={contents.length}
                currentNum={slideCurrent.current}
                slidePrev={slidePrev}
                slideNext={slideNext} />
        </ScheduledDepartures.Wrapper>
    )
}
