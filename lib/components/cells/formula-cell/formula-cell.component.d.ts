import { JxCellComponent } from "../../../models/jx-cell-component.interface";
import { JxCellContext } from "../../../models/jx-cell-context.model";
import * as i0 from "@angular/core";
/**
 * Read-only display cell that evaluates a column formula and formats the result.
 *
 * When the column definition includes a `formula` callback it is called to
 * compute the derived value.  Otherwise the raw `context.value` is used.
 * The computed value is then formatted using the column's `decimals`, `prefix`,
 * and `suffix` options before being shown.
 *
 * This cell is **not editable** — there is no editor state or `valueChange` output.
 * Use it for calculated columns such as totals, averages, or computed labels.
 *
 * @example
 * // Column definition with formula callback
 * {
 *   title: 'Total',
 *   name: 'total',
 *   editor: { component: FormulaCellComponent },
 *   formula: (row) => row.qty * row.price,
 *   decimals: 2,
 *   prefix: '€ ',
 * }
 */
export declare class FormulaCellComponent implements JxCellComponent {
    /** Grid cell context injected by `JxSpreadsheetComponent`. */
    context: JxCellContext;
    /**
     * The raw computed value before formatting.
     *
     * - When `column.formula` is a function it is called with `(row, rowIndex, ctx)`.
     * - Otherwise returns `context.value` unchanged.
     *
     * @returns The unformatted computed value.
     */
    get rawValue(): any;
    /**
     * The fully formatted display string.
     *
     * Applies numeric rounding (`column.decimals`), then wraps the result in
     * `column.prefix` and `column.suffix`.  `null`/`undefined` become empty string.
     *
     * @returns Display string shown in the cell.
     *
     * @example
     * // column: { decimals: 2, prefix: '€ ', suffix: ' EUR' }
     * // rawValue: 1234.5
     * // formattedValue: '€ 1234.50 EUR'
     */
    get formattedValue(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormulaCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FormulaCellComponent, "jx-formula-cell", never, { "context": { "alias": "context"; "required": false; }; }, {}, never, never, false, never>;
}
