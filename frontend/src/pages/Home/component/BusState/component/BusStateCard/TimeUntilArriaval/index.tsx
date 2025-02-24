
import {useEffect, useState} from "react";
import {getTravelDuration} from "@/utils/time/getTravelDuration.ts";
import {ArrivalTime} from "@/pages/Home/component/BusState/component/BusStateCard/styles.ts";

interface TimeUntilArrivalProps {
    boardingDate: string
    dropOffDate: string
}
export function TimeUntilArrival({boardingDate, dropOffDate}: TimeUntilArrivalProps) {
    const [leaveTIme, setLeaveTIme] = useState<string>("")

    const updateLeaveTime = () => {
        const time = getTravelDuration(boardingDate, dropOffDate, 1)
        setLeaveTIme(time)
    }

    useEffect(() => {
        updateLeaveTime()
        const timeout = setTimeout(updateLeaveTime, 60 * 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, []);


    return (
        <ArrivalTime>
            {leaveTIme}
        </ArrivalTime>
    )
}