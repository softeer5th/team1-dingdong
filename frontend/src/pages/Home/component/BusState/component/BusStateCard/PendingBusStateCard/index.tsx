import {
    Card, CardDestination, CardDestinationText,
    CardHeader,
    CardInfo,
    CardLocation,
    CardState,
    CardStateText,
    CardTIme
} from "@/pages/Home/component/BusState/component/BusStateCard/styles.ts";

import {getKstFormattedLabelPair} from "@/utils/time/getKstFormattedLabelPair.ts";
import {getKstTime} from "@/utils/time/getKstTime.ts";

interface PendingBusStateCardProps {
    TO_HOME?: {
        boardingDate: string;
        boardingPoint: string;
        dropOffPoint: string
    },
    TO_SCHOOL?: {
        boardingPoint: string
        dropOffPoint: string,
        dropOffDate: string
    }
}
export function PendingBusStateCard({TO_HOME, TO_SCHOOL}: PendingBusStateCardProps) {

    return (
        <Card>
            <CardHeader>
                <CardInfo>
                    <CardTIme>
                        {
                            // 하교
                            TO_HOME != null ?
                                getKstFormattedLabelPair(TO_HOME.boardingDate)[0] : null
                        }
                        {
                            // 등교
                            TO_SCHOOL != null ?
                                getKstFormattedLabelPair(TO_SCHOOL.dropOffDate)[0] : null
                        }
                    </CardTIme>
                    <CardLocation>
                        {
                            // 하교
                            TO_HOME != null ?
                                `${TO_HOME.boardingPoint} 탑승` : null
                        }
                        {
                            // 등교
                            TO_SCHOOL != null ?
                                `${TO_SCHOOL.boardingPoint} 탑승` : null
                        }
                    </CardLocation>
                </CardInfo>
                <CardState>
                    <CardStateText>
                        배차 대기
                    </CardStateText>
                </CardState>
            </CardHeader>
            <CardDestination>
                <CardDestinationText>
                    {
                        // 하교
                        TO_HOME != null ?
                            `${getKstTime(TO_HOME.boardingDate)} ${TO_HOME.dropOffPoint} 도착` : null
                    }
                    {
                        // 등교
                        TO_SCHOOL != null ?
                            `${getKstTime(TO_SCHOOL.dropOffDate)} ${TO_SCHOOL.dropOffPoint} 도착` : null
                    }
                </CardDestinationText>
            </CardDestination>
        </Card>
    )
}