import { JxAddressService } from './jx-address.service';
import * as i0 from "@angular/core";
/**
 * Lightweight built-in formula engine used by `JxWorkbookService`.
 *
 * Supports a subset of grid formulas sufficient for common aggregation
 * and cross-reference use-cases:
 * - Cell references: `B1`, `$A$5`
 * - Range aggregates: `SUM(A1:C3)`, `AVERAGE(A1:B5)`, `COUNTA(B:B)`
 * - Arithmetic expressions: `=A1+B1*2`
 * - Column field names in row formulas (e.g. `=price * qty`)
 *
 * Expressions starting with `=` are evaluated; anything else is returned as-is.
 * On evaluation errors the string `'#ERROR!'` is returned.
 *
 * For a richer formula engine (VLOOKUP, IF, nested functions, etc.) you can
 * replace this service by implementing the same interface and providing it in
 * your module, or use the `JxCellOptions.parseFormulas` flag to delegate
 * evaluation to jExcel's native engine.
 *
 * @example
 * // Inject and use directly
 * constructor(private formula: JxFormulaService) {}
 *
 * formula.isFormula('=A1+B1'); // true
 * formula.isFormula('hello');  // false
 *
 * const data = [[10, 20], [5, 15]];
 * formula.evaluate('=SUM(A1:B2)', data); // 50
 */
export declare class JxFormulaService {
    private address;
    constructor(address: JxAddressService);
    /**
     * Returns `true` when the value is a formula expression (starts with `=`)
     * or a previously computed error result (starts with `#`).
     *
     * @param value - Any cell value.
     * @returns `true` if the value should be treated as a formula or error token.
     *
     * @example
     * formula.isFormula('=SUM(A1:A3)'); // true
     * formula.isFormula('#ERROR!');      // true
     * formula.isFormula('hello');        // false
     * formula.isFormula(42);             // false
     */
    isFormula(value: any): boolean;
    /**
     * Evaluates a formula expression against the current grid data.
     *
     * - Cell references (`A1`, `$B$3`) are resolved from `data`.
     * - `SUM(A1:C3)` and `AVERAGE(A1:B5)` ranges are expanded before evaluation.
     * - Column field names listed in `fields` are substituted with the corresponding
     *   value from `data[rowIndex]` — enabling row-relative formulas like `=price*qty`.
     * - Any expression that contains unsafe characters after substitution returns `'#ERROR!'`.
     * - Formulas that throw at runtime also return `'#ERROR!'`.
     *
     * @param expression - Formula string starting with `=` (e.g. `'=A1+B2'`).
     * @param data       - Processed 2-D grid data (rows × columns).
     * @param fields     - Column field names in column order (used for named references).
     * @param rowIndex   - Zero-based row for resolving field-based references (default `0`).
     * @returns The computed value, or `'#ERROR!'` on failure.
     *
     * @example
     * const data = [[10, 5], [20, 3]];
     *
     * formula.evaluate('=A1+B1', data);               // 15
     * formula.evaluate('=SUM(A1:B2)', data);           // 38
     * formula.evaluate('=AVERAGE(A1:A2)', data);       // 15
     *
     * // Field-name reference
     * const fields = ['price', 'qty'];
     * formula.evaluate('=price*qty', data, fields, 0); // 50
     */
    evaluate(expression: string, data: any[][], fields?: string[], rowIndex?: number): any;
    /**
     * Resolves a single cell reference string (e.g. `'B3'`) to its value in `data`.
     *
     * @param ref  - Cell reference string (e.g. `'A1'`).
     * @param data - 2-D data array.
     * @returns The cell value, or `undefined` if the reference is out of bounds.
     */
    private getByAddress;
    /**
     * Sums all numeric values in the rectangular range from `a` to `b`.
     *
     * @param a    - Top-left cell reference (e.g. `'A1'`).
     * @param b    - Bottom-right cell reference (e.g. `'C3'`).
     * @param data - 2-D data array.
     * @returns The numeric sum of all values in the range.
     */
    private sumRange;
    /**
     * Computes the arithmetic mean of all numeric values in the range from `a` to `b`.
     *
     * @param a    - Top-left cell reference.
     * @param b    - Bottom-right cell reference.
     * @param data - 2-D data array.
     * @returns The average, or `0` if the range contains no numeric values.
     */
    private averageRange;
    /**
     * Collects all cell values in the rectangular range bounded by `a` (top-left)
     * and `b` (bottom-right), reading from `data`.
     *
     * @param a    - Top-left cell reference.
     * @param b    - Bottom-right cell reference.
     * @param data - 2-D data array.
     * @returns Flat array of cell values within the range.
     */
    private valuesInRange;
    /**
     * Escapes all RegExp special characters in `s` so it can be safely used
     * inside a `new RegExp(...)` constructor.
     *
     * @param s - Raw string to escape.
     * @returns A string where all regex metacharacters are backslash-escaped.
     */
    private escapeRegExp;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxFormulaService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JxFormulaService>;
}
