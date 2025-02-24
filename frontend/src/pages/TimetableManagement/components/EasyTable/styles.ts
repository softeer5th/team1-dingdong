import styled from "styled-components";

export const Table = styled.table.withConfig({
    shouldForwardProp: (prop) => !["column", "row"].includes(prop),
})<{ column?: string; row?: string }>`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    /* thead와 tbody의 직계 tr의 직계 자식 중 첫 번째가 아닌 요소에 패딩 적용 */
    > thead > tr, > tbody > tr {
        > *:not(:first-child) {
            padding-left: ${({ column = "0px" }) => column};
        }
    }

    /* tbody 내의 직계 tr의 직계 td, th에 패딩 적용 */
    > tbody > tr {
        > td, > th {
            padding-top: ${({ row = "0px" }) => row};
        }
    }
`;
