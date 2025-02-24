import EasyTable, {ColumnInferface, RowInterace} from "@/pages/TimetableManagement/components/EasyTable";
import {Fragment} from "react";
import {
    DirectionBox, DirectionText,
    DirectionType, DirectionTypeText,
    InfoBox,
    InfoText,
    TableBody,
    TableHead,
    TableText, TableWrapper, Title, Wrapper
} from "@/pages/Payment/Reservation/components/BookingSchedule/styles.ts";
import {colors} from "@/styles/colors.ts";
import ArrowRight2 from "@/components/designSystem/Icons/Payment/ArrowRight2.tsx";
import {ScheduleInterface} from "@/route/loader/payment/reservation/loader.tsx";
import {getKstDay} from "@/utils/time/getKstDay.ts";
import {getKstTime} from "@/utils/time/getKstTime.ts";



interface BookingScheduleProps {
    schedule: ScheduleInterface,
    borderingPoint: string

}
export default function BookingSchedule({schedule, borderingPoint}: BookingScheduleProps) {
    const COLUMN_NAME_LIST = [
        "날짜",
        "탑승지",
        "도착 시간"
    ]


    const colum: ColumnInferface = {
        count: 3,
        width: [
            '80px',
            'calc((100% - 80px) / 2)',
            'calc((100% - 80px) / 2)'
        ],
        headNode: [
            ...COLUMN_NAME_LIST.map((columnName, index) => (
                <TableHead  textAlignLeft={index !== (COLUMN_NAME_LIST.length - 1)}>
                    <TableText color={colors.gray70}>
                        {columnName}
                    </TableText>
                </TableHead>
            ))
        ]
    }
    const row: RowInterace = {
        count: schedule.timeSchedule.length + 1,
    }



    return (
        <Wrapper>
            <Title>
                예매 일정
            </Title>
            <InfoBox>
                <InfoText>
                    배차 확정 여부와 탑승 시각은
                </InfoText>
                <br />
                <InfoText>
                    탑승&nbsp;
                </InfoText>
                <InfoText isHighlight={true}>
                    48시간&nbsp;전
                </InfoText>
                <InfoText>
                    에 안내드려요.
                </InfoText>
            </InfoBox>
            <DirectionBox>
                <DirectionType>
                    <DirectionTypeText>
                        {
                            schedule.direction === 'TO_HOME' ?
                                '하교' : null
                        }
                        {
                            schedule.direction === 'TO_SCHOOL' ?
                                '등교' : null
                        }
                    </DirectionTypeText>
                </DirectionType>
                <DirectionText>
                    {
                        schedule.direction === 'TO_HOME' ?
                            '학교' : null
                    }
                    {
                        schedule.direction === 'TO_SCHOOL' ?
                            '집' : null
                    }
                </DirectionText>
                <ArrowRight2 />
                <DirectionText>
                    {
                        schedule.direction === 'TO_HOME' ?
                            '집' : null
                    }
                    {
                        schedule.direction === 'TO_SCHOOL' ?
                            '학교' : null
                    }
                </DirectionText>
            </DirectionBox>
            <TableWrapper>
                <EasyTable column={colum} row={row}>
                    {
                        schedule.timeSchedule.map((time, index) => (
                            <Fragment key={index}>
                                <TableBody>
                                    <TableText color={colors.gray100}>
                                        {getKstDay(time, 1)}
                                    </TableText>
                                </TableBody>
                                <TableBody>
                                    <TableText color={colors.gray100}>
                                        {borderingPoint}
                                    </TableText>
                                </TableBody>
                                <TableBody textAlignLeft={false}>
                                    <TableText color={colors.gray100}>
                                        {getKstTime(time)}
                                    </TableText>
                                </TableBody>
                            </Fragment>
                        ))
                    }
                </EasyTable>
            </TableWrapper>
        </Wrapper>
    )
}