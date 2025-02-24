
// 스타일
import {
    ImgActionButton, ImgActionText, ImgRegistrationBox, InfoText, InfoTitle,
    PageDescription, PageInfoSection, PageInfoTextBox,
    PageMain,
    PageTitle,
    TableHeader,
    TableHeaderText, TableWrapper
} from "@/pages/TimetableManagement/styles.ts";
// 컴포넌트
import PopHeader from "@/components/Headers/PopHeader";
import PlusIcon from "@/components/designSystem/Icons/TimeTableManagement/PlusIcon.tsx";
import InfoIcon from "@/components/designSystem/Icons/TimeTableManagement/InfoIcon.tsx";
import EasyTable, {ColumnInferface, RowInterace} from "@/pages/TimetableManagement/components/EasyTable";
import {colors} from "@/styles/colors.ts";
import {useRef} from "react";
import {useLoaderData} from "react-router-dom";
import {users_timetable_interface} from "@/api/query/users";
import useToast from "@/hooks/useToast";
import {fetchTimetable} from "@/pages/TimetableManagement/utils/fetchTimetable.ts";
import {renderTableRow} from "@/pages/TimetableManagement/utils/renderTableRow.tsx";


export default function Page() {
    const [timetable]: [users_timetable_interface] = useLoaderData()
    const addToast = useToast();
    const timetableRef = useRef({
        ...timetable
    })
    const setTimetableRef = (key: string, value: string | null) => {
        const typeKey = key as keyof users_timetable_interface
        timetableRef.current[typeKey] = value
    }


    const DAYS_OF_WEEK = [
        '월',
        '화',
        '수',
        '목',
        '금',
    ]
    const COLUMN_NAME_LIST = [
        '',
        '등교',
        '하교'
    ]

    const column: ColumnInferface = {
        count: 3,
        width: [
            '20px',
            'calc((100% - 20px) / 2)',
            'calc((100% - 20px) / 2)'
        ],
        headNode: [
            ...COLUMN_NAME_LIST.map((columnName) => (
                <TableHeader>
                    <TableHeaderText color={colors.gray70}>
                        {columnName}
                    </TableHeaderText>
                </TableHeader>
            ))
        ],
        gap: '16px'
    }
    const row: RowInterace = {
        count: DAYS_OF_WEEK.length + 1,
        headNode: [
            ...DAYS_OF_WEEK.map((rowName) => (
                <TableHeader>
                    <TableHeaderText color={colors.gray70}>
                        {rowName}
                    </TableHeaderText>
                </TableHeader>
            ))
        ],
        gap: '6px;'
    }

    return (
        <div>
            <PopHeader text={"시간표 등록"} />
            <PageMain>
                <PageTitle>
                    시간표 등록으로 더 쉬운 예매
                </PageTitle>
                <PageDescription>
                    나의 강의가 있는 요일과 시간에 맞추어 최적의 예매 옵션을 추천드려요.
                </PageDescription>
                <TableWrapper>
                    <EasyTable column={column} row={row}>
                        {renderTableRow({
                            timetable: timetableRef.current,
                            setTimetable: setTimetableRef,})}
                    </EasyTable>
                </TableWrapper>
                <ImgRegistrationBox>
                    {/* 서버 이미지 없으면 */}
                    <ImgActionButton onClick={() => fetchTimetable(timetableRef.current, addToast)}>
                        <PlusIcon />
                        <ImgActionText>
                            시간표 저장하기
                        </ImgActionText>
                    </ImgActionButton>
                </ImgRegistrationBox>
                <PageInfoSection>
                    <InfoIcon />
                    <PageInfoTextBox>
                        <InfoTitle>
                            시간표를 등록하면 등하교 예매를 더욱 편리하게 이용할 수 있습니다.
                        </InfoTitle>
                        <InfoText>
                            ※ 등교 시간은 반드시 하교 시간보다 앞선 시간이어야 합니다.
                        </InfoText>
                    </PageInfoTextBox>
                </PageInfoSection>
            </PageMain>
        </div>
    )
}


