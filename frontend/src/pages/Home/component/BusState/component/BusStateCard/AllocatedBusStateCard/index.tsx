import {
    Card, CardDestination, CardDestinationText,
    CardHeader,
    CardInfo,
    CardLocation,
    CardTIme,
    CardBusInfo,
    CardBusNumber,
    Divider,
    CardAction,
    CardActionText
} from "@/pages/Home/component/BusState/component/BusStateCard/styles.ts";

import {useNavigate} from "react-router-dom";
import {getKstFormattedLabelPair} from "@/utils/time/getKstFormattedLabelPair.ts";
import BusIcon from "@/components/designSystem/Icons/Home/BusIcon.tsx";
import {getTravelDuration} from "@/utils/time/getTravelDuration.ts";
import ArrowRightIcon from "@/components/designSystem/Icons/Home/ArrowRightIcon.tsx";
import {TimeUntilArrival} from "@/pages/Home/component/BusState/component/BusStateCard/TimeUntilArriaval";
import {getKstTime} from "@/utils/time/getKstTime.ts";

interface AllocatedBusStateCardProps {
    boardingDate: string;
    boardingPoint: string;
    dropOffPoint: string;
    dropOffDate: string;
    isRun: boolean;
    busNumber: string;
    busScheduleId: number;
    isLink: boolean
}
export function AllocatedBusStateCard({
                                          boardingDate,
                                          boardingPoint,
                                          dropOffPoint,
                                          dropOffDate,
                                          isRun,
                                          busNumber,
                                          busScheduleId,
                                          isLink = true
                                      }: AllocatedBusStateCardProps) {
    const navigate = useNavigate();


    return (
        <Card>
            <CardHeader>
                <CardInfo>
                    <CardTIme>
                        {getKstFormattedLabelPair(boardingDate).join(' ')}
                    </CardTIme>
                    <CardLocation>
                        {`${boardingPoint} 탑승`}
                    </CardLocation>
                </CardInfo>
            </CardHeader>
            <CardBusInfo>
                <BusIcon />
                <CardBusNumber>
                    {busNumber}
                </CardBusNumber>
                {
                    isRun ? <TimeUntilArrival boardingDate={boardingDate} dropOffDate={dropOffDate}/> : null
                }
            </CardBusInfo>
            <CardDestination>
                <CardDestinationText>
                    {`${getKstTime(dropOffDate)} ${dropOffPoint} 도착`}
                </CardDestinationText>
                <Divider />
                <CardDestinationText>
                    {`${getTravelDuration(boardingDate, dropOffDate)}`}
                </CardDestinationText>
            </CardDestination>
            {
                isLink &&
                <CardAction onClick={() => navigate(`/bus-tracker?busScheduleId=${busScheduleId}`)}>
                    <CardActionText>
                        {isRun ? "실시간 버스 위치 확인" : "버스 경로 확인"}
                    </CardActionText>
                    <ArrowRightIcon />
                </CardAction>
            }
        </Card>
    )
}