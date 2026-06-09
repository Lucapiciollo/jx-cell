import { JxColumn } from "./jx-column.model";
export interface JxCellContext<T = any> {
    row: T;
    rowIndex: number;
    column: JxColumn<T>;
    columnIndex: number;
    value: any;
    editable: boolean;
    config?: any;
}
