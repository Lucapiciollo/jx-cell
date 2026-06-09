import * as i0 from "@angular/core";
/**
 * Service for clipboard operations (copy/paste) with Excel-compatible formatting.
 *
 * Uses the **Tab-Separated Values (TSV)** format so pasted data round-trips
 * correctly in Microsoft Excel, Google Sheets, and LibreOffice Calc.
 *
 * All async methods use the modern `navigator.clipboard` API.  In environments
 * where clipboard access is denied (non-HTTPS, permissions blocked) the methods
 * log a warning and degrade gracefully (copy fails silently; read returns `''`).
 *
 * This service is provided in the Angular root injector (`providedIn: 'root'`),
 * so it is shared across all grid instances in the application.
 *
 * @example
 * // Copy a 2-D range to the system clipboard
 * await clipboard.copyToClipboard([['A1', 'B1'], ['A2', 'B2']]);
 *
 * // Read back and parse
 * const text = await clipboard.readFromClipboard();
 * const cells = clipboard.parseClipboardText(text);
 */
export declare class JxClipboardService {
    /**
     * Serialises a 2-D array of cells to tab-separated values (TSV / Excel format).
     *
     * - Rows are joined with `\n`.
     * - Columns are joined with `\t`.
     * - `null` / `undefined` cells become empty strings.
     * - Object values are JSON-stringified.
     *
     * @param data - 2-D array of cell values to serialise.
     * @returns TSV string ready to be written to the clipboard.
     *
     * @example
     * clipboard.serializeRange([[1, 'A'], [2, 'B']]);
     * // → '1\tA\n2\tB'
     */
    serializeRange(data: any[][]): string;
    /**
     * Parses tab-separated clipboard text into a 2-D array.
     *
     * - Splits on `\n` (rows) and `\t` (columns).
     * - Trims surrounding whitespace from each cell.
     * - Empty cells become `null`.
     *
     * @param text - Raw TSV string from the clipboard.
     * @returns 2-D array of parsed cell values (`string | null`).
     *
     * @example
     * clipboard.parseClipboardText('1\tA\n2\tB');
     * // → [['1', 'A'], ['2', 'B']]
     */
    parseClipboardText(text: string): any[][];
    /**
     * Serialises `data` as TSV and writes it to the system clipboard via
     * `navigator.clipboard.writeText()`.
     *
     * @param data - 2-D array of cell values to copy.
     * @returns Promise that resolves when the write succeeds.
     * @throws Re-throws any clipboard write error (e.g. permission denied).
     *
     * @example
     * await clipboard.copyToClipboard([['A', 'B'], ['C', 'D']]);
     */
    copyToClipboard(data: any[][]): Promise<void>;
    /**
     * Reads raw text from the system clipboard via `navigator.clipboard.readText()`.
     *
     * Returns an empty string when access is denied or the API is unavailable
     * (logs a warning instead of throwing).
     *
     * @returns Promise that resolves with clipboard text, or `''` on failure.
     *
     * @example
     * const text = await clipboard.readFromClipboard();
     * const cells = clipboard.parseClipboardText(text);
     */
    readFromClipboard(): Promise<string>;
    /**
     * Extracts a rectangular sub-range from the full data matrix.
     *
     * Works with both positional arrays (`any[][]`) and object-based rows.
     * For object-based rows, pass `columnNames` so the correct field names
     * are used to look up values.
     *
     * @param data         - Full source data matrix.
     * @param xStart       - Start column index (inclusive, 0-based).
     * @param xEnd         - End column index (inclusive, 0-based).
     * @param yStart       - Start row index (inclusive, 0-based).
     * @param yEnd         - End row index (inclusive, 0-based).
     * @param columnNames  - Optional array of column field names for object rows.
     * @returns 2-D array containing the extracted cell values.
     *
     * @example
     * const data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
     * clipboard.extractRange(data, 1, 2, 0, 1);
     * // → [[2, 3], [5, 6]]
     */
    extractRange(data: any[][], xStart: number, xEnd: number, yStart: number, yEnd: number, columnNames?: string[]): any[][];
    /**
     * Writes a 2-D array of values into the data matrix starting at `(startX, startY)`,
     * extending rows and columns as needed.
     *
     * Works with both positional arrays (`any[][]`) and object-based rows.
     * For object-based rows pass `columnNames` so the correct keys are used.
     *
     * @param data        - Target mutable data matrix (mutated in-place).
     * @param pasteData   - 2-D array of values to paste.
     * @param startX      - Zero-based starting column index.
     * @param startY      - Zero-based starting row index.
     * @param columnNames - Optional column field names for object-based rows.
     *
     * @example
     * const grid = [[1, 2], [3, 4]];
     * clipboard.insertRange(grid, [['X', 'Y']], 1, 0);
     * // grid → [[1, 'X', 'Y'], [3, 4]]
     */
    insertRange(data: any[][], pasteData: any[][], startX: number, startY: number, columnNames?: string[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxClipboardService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JxClipboardService>;
}
