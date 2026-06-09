import * as i0 from "@angular/core";
/**
 * Utility service for converting between spreadsheet cell addresses (e.g. `"A1"`)
 * and zero-based `{x, y}` coordinate pairs.
 *
 * This service is provided in root and consumed internally by `JxWorkbookService`
 * and `JxSpreadsheetComponent`. You can also inject it directly when you need
 * address arithmetic in your own code.
 *
 * @example
 * // Inject in a component or service
 * constructor(private address: JxAddressService) {}
 *
 * this.address.columnName(0);   // → 'A'
 * this.address.columnName(25);  // → 'Z'
 * this.address.columnName(26);  // → 'AA'
 *
 * this.address.cellName(2, 3);  // → 'C4'
 *
 * this.address.parse('B5');     // → { x: 1, y: 4 }
 * this.address.parse('AA1');    // → { x: 26, y: 0 }
 */
export declare class JxAddressService {
    /**
     * Converts a zero-based column index to its spreadsheet letter name.
     *
     * Uses the same alphabetical encoding as Excel / jSpreadsheet:
     * 0→A, 25→Z, 26→AA, 51→AZ, 52→BA …
     *
     * @param index - Zero-based column index.
     * @returns The column letter string (e.g. `'A'`, `'Z'`, `'AA'`).
     *
     * @example
     * address.columnName(0);   // 'A'
     * address.columnName(26);  // 'AA'
     * address.columnName(701); // 'ZZ'
     */
    columnName(index: number): string;
    /**
     * Returns the spreadsheet cell name for a given pair of zero-based coordinates.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     * @returns Cell name string, e.g. `'A1'`, `'B3'`, `'AA10'`.
     *
     * @example
     * address.cellName(0, 0); // 'A1'
     * address.cellName(2, 4); // 'C5'
     */
    cellName(x: number, y: number): string;
    /**
     * Parses a spreadsheet cell address string into zero-based `{x, y}` coordinates.
     *
     * Accepts uppercase or lowercase input (e.g. `'A1'`, `'b3'`, `'AA10'`).
     * Returns `null` for any string that does not match the `<letters><digits>` pattern.
     *
     * @param address - Cell name string, e.g. `'A1'` or `'AA10'`.
     * @returns `{ x, y }` zero-based coordinates, or `null` if the address is invalid.
     *
     * @example
     * address.parse('A1');  // { x: 0, y: 0 }
     * address.parse('B5');  // { x: 1, y: 4 }
     * address.parse('AA2'); // { x: 26, y: 1 }
     * address.parse('');    // null
     */
    parse(address: string): {
        x: number;
        y: number;
    } | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxAddressService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JxAddressService>;
}
