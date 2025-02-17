import {useEffect, useRef, useState} from "react";
import {ScheduledDepartures} from "./styles.ts";
import ArrowRightIcon from "@/components/designSystem/Icons/Reservations/ArrowRightIcon";
import ArrowLeftIcon from "@/components/designSystem/Icons/Reservations/ArrowLeftIcon";
import LocationIcon from "@/components/designSystem/Icons/Reservations/LocationIcon";
import CalenderIcon from "@/components/designSystem/Icons/Reservations/CalenderIcon"
import ClockIcon from "@/components/designSystem/Icons/Reservations/ClockIcon"
import ArrowRight2Icon from "@/components/designSystem/Icons/Reservations/ArrowRight2Icon"
import {TO_HOME_ALLOCATED, TO_SCHOOL_ALLOCATED, users_reservations_interface} from "@/api/query/users";
import {formatKstDate} from "@/utils/time/formatKstDate.ts";
import {formatKstTime} from "@/utils/time/formatKstTime.ts";

const PREV = -1;
const CURRENT = 0;
const NEXT = 1;

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
                {
                    renderCards({
                        slideCurrent,
                        slideState,
                        countRef,
                        data: contents.map(content => ({
                            direction: content.direction,
                            date: content.direction === 'TO_HOME' ? formatKstDate(content.operationInfo.busStopArrivalTime, 1) : formatKstDate(content.expectedArrivalTime, 1),
                            location: content.busStopName,
                            time: `${content.direction === 'TO_HOME' ? formatKstTime(content.expectedDepartureTime) : formatKstTime(content.operationInfo.busStopArrivalTime)} 탑승`
                        }))
                    })
                }
            </ScheduledDepartures.Slider>
            <ScheduledDepartures.SliderControls>
                {
                    contents.length > 1 ?
                        <ScheduledDepartures.SlideButton onClick={slidePrev}>
                            <ArrowLeftIcon />
                        </ScheduledDepartures.SlideButton>:
                        null
                }
                <ScheduledDepartures.SlideCounter isCurrent={true}>
                    {slideCurrent.current + 1}
                </ScheduledDepartures.SlideCounter>
                <ScheduledDepartures.SlideCounter>
                    /
                </ScheduledDepartures.SlideCounter>
                <ScheduledDepartures.SlideCounter>
                    {contents.length}
                </ScheduledDepartures.SlideCounter>
                {
                    contents.length > 1 ?
                        <ScheduledDepartures.SlideButton onClick={slideNext}>
                            <ArrowRightIcon />
                        </ScheduledDepartures.SlideButton> :
                        null
                }
            </ScheduledDepartures.SliderControls>
        </ScheduledDepartures.Wrapper>
    )
}

/* 종속적인 컴포넌트(모듈) */
type CardProps = {
    count: number,
    toUniversity: boolean,
    date: string,
    location: string,
    time: string,
    isHidden?: boolean
    isAbsolute?: boolean
}
function Card({count, toUniversity, date, location, time, isHidden = false, isAbsolute = true}: CardProps) {

    return (
        <ScheduledDepartures.Card style={isHidden ? {visibility: 'hidden'}: undefined} isAbsolute={isAbsolute} count={count}>
            <ScheduledDepartures.CardHeader>
                <ScheduledDepartures.Title>
                    탑승 예정
                </ScheduledDepartures.Title>
                <ScheduledDepartures.Direction>
                    <ScheduledDepartures.DirectionText>
                        {
                            toUniversity ? "집" : "학교"
                        }
                    </ScheduledDepartures.DirectionText>
                    <ArrowRight2Icon />
                    <ScheduledDepartures.DirectionText>
                        {
                            toUniversity ? "학교" : "집"
                        }
                    </ScheduledDepartures.DirectionText>
                </ScheduledDepartures.Direction>
            </ScheduledDepartures.CardHeader>
            <ScheduledDepartures.CardPunchHole left={true}/>
            <ScheduledDepartures.CardPunchHole left={false}/>
            <ScheduledDepartures.CardBody>
                <ScheduledDepartures.InfoBox>
                    <CalenderIcon />
                    <ScheduledDepartures.InfoText>
                        {date}
                    </ScheduledDepartures.InfoText>
                </ScheduledDepartures.InfoBox>
                <ScheduledDepartures.InfoBox>
                    <LocationIcon />
                    <ScheduledDepartures.InfoText>
                        {location}
                    </ScheduledDepartures.InfoText>
                </ScheduledDepartures.InfoBox>
                <ScheduledDepartures.InfoBox>
                    <ClockIcon />
                    <ScheduledDepartures.InfoText>
                        {time}
                    </ScheduledDepartures.InfoText>
                </ScheduledDepartures.InfoBox>
            </ScheduledDepartures.CardBody>
        </ScheduledDepartures.Card>
    )
}

function HiddenCard() {
    return (
        <Card count={0} toUniversity={true} date={'1'} location={'1'} time={'1'} isHidden={true} isAbsolute={false}/>
    )
}



/* helper function */
interface renderCardsProps {
    slideCurrent: React.MutableRefObject<number>,
    slideState: { isNext: boolean } | null,
    countRef: React.MutableRefObject<number[]>,
    data: {
        direction: users_reservations_interface['reservationInfos']['content'][number]['direction'];
        date: string,
        location: string,
        time: string
    }[]
}
function renderCards({slideCurrent, slideState, countRef, data}: renderCardsProps) {
    const prev = slideCurrent.current > 0 ? slideCurrent.current - 1 : data.length - 1;
    const current = slideCurrent.current
    const next = slideCurrent.current < data.length - 1 ? slideCurrent.current + 1 : 0;

    return countRef.current.map((count, index) => {
        if (count === PREV) {
            return (
                <Card key={index} isHidden={!slideState?.isNext} count={count} toUniversity={data[current].direction === 'TO_SCHOOL'} date={data[prev].date} location={data[prev].location} time={data[prev].time}/>
            )
        }
        if (count === CURRENT) {
            return (
                <Card key={index} count={count} toUniversity={data[current].direction === 'TO_SCHOOL'} date={data[current].date} location={data[current].location} time={data[current].time}/>
            )
        }
        if (count === NEXT) {
            return (
                <Card key={index} isHidden={!!slideState?.isNext} count={count} toUniversity={data[current].direction === 'TO_SCHOOL'} date={data[next].date} location={data[next].location} time={data[next].time}/>
            )
        }
    })

}

