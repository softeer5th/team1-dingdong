import {ScheduledDepartures} from "@/pages/Reservations/components/CardSlider/styles.ts";
import ArrowRight2Icon from "@/components/designSystem/Icons/Reservations/ArrowRight2Icon.tsx";
import CalenderIcon from "@/components/designSystem/Icons/Reservations/CalenderIcon.tsx";
import LocationIcon from "@/components/designSystem/Icons/Reservations/LocationIcon.tsx";
import ClockIcon from "@/components/designSystem/Icons/Reservations/ClockIcon.tsx";

export default function NullCard() {
    return (
        <ScheduledDepartures.Card isAbsolute={true} count={0}>
            <ScheduledDepartures.CardHeader>
                <ScheduledDepartures.Title>
                    운행 정보 없음
                </ScheduledDepartures.Title>
                <ScheduledDepartures.Direction>
                    <ScheduledDepartures.DirectionText>
                        -
                    </ScheduledDepartures.DirectionText>
                    <ArrowRight2Icon />
                    <ScheduledDepartures.DirectionText>
                        -
                    </ScheduledDepartures.DirectionText>
                </ScheduledDepartures.Direction>
            </ScheduledDepartures.CardHeader>
            <ScheduledDepartures.CardPunchHole left={true}/>
            <ScheduledDepartures.CardPunchHole left={false}/>
            <ScheduledDepartures.CardBody>
                <ScheduledDepartures.InfoBox>
                    <CalenderIcon />
                    <ScheduledDepartures.InfoText>
                        -
                    </ScheduledDepartures.InfoText>
                </ScheduledDepartures.InfoBox>
                <ScheduledDepartures.InfoBox>
                    <LocationIcon />
                    <ScheduledDepartures.InfoText>
                        -
                    </ScheduledDepartures.InfoText>
                </ScheduledDepartures.InfoBox>
                <ScheduledDepartures.InfoBox>
                    <ClockIcon />
                    <ScheduledDepartures.InfoText>
                        -
                    </ScheduledDepartures.InfoText>
                </ScheduledDepartures.InfoBox>
            </ScheduledDepartures.CardBody>
        </ScheduledDepartures.Card>
    )
}
