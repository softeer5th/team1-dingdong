import {useEffect, useState} from "react";
import {TableCell, TableCellText} from "@/pages/TimetableManagement/styles.ts";
import {mountModal} from "@/components/Loading";
import TimePicker from "@/pages/TimetableManagement/components/TimePicker";
import DeleteIcon from "@/components/designSystem/Icons/TimeTableManagement/DeleteIcon.tsx";

interface TableItemProps {
    timeKey: string
    time: string
    setTimetable: (key: string, value: string | null) => void
}
export default function TableItem({ timeKey, time, setTimetable }: TableItemProps) {
    const [timeState, setTimeState] = useState(time)

    useEffect(() => {
        setTimetable(timeKey, timeState === '-' ? null : timeState)
    }, [timeState])


    return (
        <TableCell onClick={() => {
            const {render, unmountModal} = mountModal()
            render(
                <TimePicker
                    unmountModal={unmountModal}
                    timeState={timeState}
                    setTimeState={setTimeState}/>)
        }}>
            <TableCellText>
                {timeState}
            </TableCellText>
            {!(timeState === '-') && (
                <button onClick={(e) => {
                    e.stopPropagation()
                    setTimeState('-')
                }}>
                    <DeleteIcon />
                </button>
            )}
        </TableCell>
    )
}
