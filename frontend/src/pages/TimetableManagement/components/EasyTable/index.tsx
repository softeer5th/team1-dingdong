import {Children, ReactElement, ReactNode} from "react";
import {Table} from "@/pages/TimetableManagement/components/EasyTable/styles.ts";


export interface ColumnInferface {
    count: number;
    width?: string[];
    backgroundColor?: string[];
    headNode?: ReactNode[];
    gap?: string;
}
export interface RowInterace {
    count: number;
    backgroundColor?: string[];
    headNode?: ReactNode[];
    gap?: string;
}

interface CreateTableProps {
    column: ColumnInferface,
    row: RowInterace,
    children: ReactElement[],
}
export default function EasyTable({column, row, children}: CreateTableProps) {
    const hasColumnHead = (column.headNode?.length ?? 0) > 0;

    // 데이터 유효성 검사
    if (column.count <= 0) {
        throw new Error("Column count must be greater than zero");
    }
    if (column.width && column.width.length !== column.count) {
        throw new Error(`Expected column.width length to be ${column.count}, but got ${column.width.length}`);
    }
    if (column.backgroundColor && column.backgroundColor.length !== column.count) {
        throw new Error(`Expected column.backgroundColor length to be ${column.count}, but got ${column.backgroundColor.length}`);
    }
    if (column.headNode && column.headNode.length !== column.count) {
        throw new Error(`Expected column.headNode length to be ${column.count}, but got ${column.headNode.length}`);
    }

    if (row.count <= 0) {
        throw new Error("Row count must be greater than zero");
    }
    if (row.backgroundColor && row.backgroundColor.length !== row.count) {
        throw new Error(`Expected row.backgroundColor length to be ${row.count}, but got ${row.backgroundColor.length}`);
    }
    // 여기서는 헤더 행이 따로 분리되므로, row.headNode 배열은 바디 행의 개수(전체 행 수 - 헤더 행 존재 시 1)를 따라야 합니다.
    if (row.headNode && row.headNode.length !== (row.count - (hasColumnHead ? 1 : 0))) {
        throw new Error(`Expected row.headNode length to be ${row.count - (hasColumnHead ? 1 : 0)}, but got ${row.headNode.length}`);
    }
    // children 배열의 길이도 바디 행 수와 일치해야 합니다.
    if (children.length !== (row.count - (hasColumnHead ? 1 : 0))) {
        throw new Error(`Expected children count to be ${row.count - (hasColumnHead ? 1 : 0)}, but got ${children.length}`);
    }



    return (
        <Table column={column.gap} row={row.gap}>
            <CreateColumnStyle column={column} />
            <CreateColumnHeader headNode={column.headNode} row={row} />
            <CreateColumnBody hasColumnHead={hasColumnHead} row={row} children={children} />
        </Table>
    )
}



function CreateColumnStyle({column}: {column: CreateTableProps["column"] }) {
    return (
        <colgroup>
            {
                Array(column.count).fill(null).map((_, i) => (
                    <col key={i} style={{ width: column.width?.[i], backgroundColor: column.backgroundColor?.[i] }}/>
                ))
            }
        </colgroup>
    )
}


interface CrateColumnHeaderProps {
    headNode: CreateTableProps["column"]["headNode"];
    row: CreateTableProps["row"];
}
function CreateColumnHeader({headNode, row}: CrateColumnHeaderProps) {
    if (headNode?.length === 0 || row.count === 0) {
        return null
    }

    return (
        <thead>
            <tr style={{ backgroundColor: row.backgroundColor?.[0] }}>
                {
                    headNode?.map((element, index) => (
                        <th key={index}>
                            {element}
                        </th>
                    ))
                }
            </tr>
        </thead>
    )
}

interface CreateColumnBodyProps {
    row: CreateTableProps["row"];
    children: CreateTableProps["children"];
    hasColumnHead: boolean;
}
function CreateColumnBody({row, children, hasColumnHead}: CreateColumnBodyProps) {
    const bodyRowCount = row.count - (hasColumnHead ? 1 : 0);
    const hasRowHead = (row.headNode?.length ?? 0) > 0


    return (
        <tbody>
            {
                Array(bodyRowCount).fill(null)
                    .map((_, i) => (
                        <tr key={i} style={{ backgroundColor: row.backgroundColor?.[i + (hasColumnHead ? 1 : 0)] }}>
                            {
                                hasRowHead ?
                                    <th>
                                        {row.headNode?.[i]}
                                    </th>:
                                    null
                            }
                            {
                                Children.toArray(children[i].props.children).map((element, i) => (
                                    <td key={i}>
                                        {element}
                                    </td>
                                ))
                            }
                        </tr>
                    ))
            }
        </tbody>
    )

}



