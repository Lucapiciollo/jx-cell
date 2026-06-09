import { JxColumn } from "./jx-column.model";
export interface JxCellChangeEvent<T = any> {
    row: T;
    rowIndex: number;
    column: JxColumn<T>;
    columnIndex: number;
    oldValue: any;
    newValue: any;
}
export interface JxCellActionEvent<T = any> {
    row: T;
    rowIndex: number;
    column: JxColumn<T>;
    columnIndex: number;
    value: any;
    action: string;
    payload?: any;
}
