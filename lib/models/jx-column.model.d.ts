import { Type } from "@angular/core";
import { JxCellComponent } from "./jx-cell-component.interface";
export type JxCellType = "text" | "number" | "checkbox" | "button" | "attachment" | "formula" | "custom" | string;
export interface JxFormulaMeta<T = any> {
    value: any;
    column: JxColumn<T>;
    columnIndex: number;
}
export interface JxColumn<T = any> {
    key: keyof T | string;
    label: string;
    type?: JxCellType;
    width?: string | number;
    editable?: boolean;
    hidden?: boolean;
    cssClass?: string;
    headerCssClass?: string;
    component?: Type<JxCellComponent<T>>;
    /**
     * Formula calcolata sulla riga.
     * Non modifica il dato originale: mostra solo il risultato nella cella.
     */
    formula?: (row: T, rowIndex: number, meta: JxFormulaMeta<T>) => any;
    /** Formattazione semplice per celle numeriche/formula. */
    decimals?: number;
    prefix?: string;
    suffix?: string;
    config?: any;
}
