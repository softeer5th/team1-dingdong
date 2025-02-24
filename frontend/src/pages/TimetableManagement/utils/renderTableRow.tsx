import {users_timetable_interface} from "@/api/query/users";
import {Fragment} from "react";
import TableItem from "@/pages/TimetableManagement/components/TableItem";


interface RenderTableRowProps {
    timetable: users_timetable_interface
    setTimetable: (key: string, value: string | null) => void
}
export function renderTableRow({ timetable, setTimetable }: RenderTableRowProps) {
    let data2: {key: keyof users_timetable_interface, time: string}[] = []
    const data: {key: keyof users_timetable_interface, time: string}[][] = []

    Object.keys(timetable).forEach((key, index) => {
        const typedKey = key as keyof users_timetable_interface
        const date = timetable[typedKey]?.split(':').slice(0, 2).join(':') ?? '-'
        if (index % 2 === 0) {
            data2 = [{
                key: typedKey,
                time: date
            }]
            data.push(data2)
        }
        else {
            data2.push({
                key: typedKey,
                time: date
            })
        }
    })


    return data.map((data, index) => (
        <Fragment key={index}>
            <TableItem timeKey={data[0].key} time={data[0].time} setTimetable={setTimetable} />
            <TableItem timeKey={data[1].key} time={data[1].time} setTimetable={setTimetable} />
        </Fragment>
    ));
}