import ArrowRight2Icon from "@/components/designSystem/Icons/Reservations/ArrowRight2Icon.tsx";
import CalenderIcon from "@/components/designSystem/Icons/Reservations/CalenderIcon.tsx";
import LocationIcon from "@/components/designSystem/Icons/Reservations/LocationIcon.tsx";
import ClockIcon from "@/components/designSystem/Icons/Reservations/ClockIcon.tsx";
import {ScheduledDepartures} from "@/pages/Reservations/components/CardSlider/styles.ts";

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
export default function Card({count, toUniversity, date, location, time, isHidden = false, isAbsolute = true}: CardProps) {

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

export function HiddenCard() {
    return (
        <Card count={0} toUniversity={true} date={'1'} location={'1'} time={'1'} isHidden={true} isAbsolute={false}/>
    )
}