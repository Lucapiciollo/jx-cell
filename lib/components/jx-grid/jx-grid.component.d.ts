import { AfterViewInit, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { JxColumn } from "../../models/jx-column.model";
import { JxGridOptions } from "../../models/jx-grid-options.model";
import { JxCellActionEvent, JxCellChangeEvent } from "../../models/jx-cell-event.model";
import * as i0 from "@angular/core";
/**
 * Lightweight data-grid component for displaying and editing typed row arrays.
 *
 * `JxGridComponent` is the Angular-native counterpart of `JxSpreadsheetComponent`.
 * Rather than wrapping the jSpreadsheet library, it renders rows via Angular's
 * own `*ngFor` + a dynamic cell-host (`<jx-cell-host>`) so Angular change
 * detection and DI work seamlessly.
 *
 * ## Features
 * - Strongly-typed columns via `JxColumn<T>`
 * - Built-in cell types: `text`, `number`, `checkbox`, `formula`, `button`, `attachment`
 * - Custom cell components via `column.component`
 * - Virtual scrolling — renders only the visible window (+ 5-row buffer),
 *   keeping DOM node count constant for any dataset size
 * - Row selection, column hide/show, editable guard
 * - `cellChange`, `cellAction`, `rowSelect` outputs
 *
 * ## Usage
 * ```html
 * <jx-grid
 *   [data]="rows"
 *   [columns]="columns"
 *   [options]="opts"
 *   (cellChange)="onChange($event)"
 *   (rowSelect)="onSelect($event)">
 * </jx-grid>
 * ```
 *
 * ## Virtual scroll example
 * ```typescript
 * opts: JxGridOptions = {
 *   virtualScroll: true,
 *   virtualScrollHeight: '480px',
 *   rowHeight: 40,
 * };
 * ```
 *
 * @template T  Row object type — must extend `Record<string, any>`.
 */
export declare class JxGridComponent<T extends Record<string, any> = any> implements OnChanges, AfterViewInit {
    /** The full row dataset. Only the visible window is rendered when `virtualScroll` is on. */
    data: T[];
    /** Column definitions that control rendering, editing, and width of each column. */
    columns: JxColumn<T>[];
    /** Grid behaviour options (editable, selectable, virtual scroll, row height, …). */
    options: JxGridOptions;
    /** Emits when the user commits a cell edit. */
    cellChange: EventEmitter<JxCellChangeEvent<T>>;
    /** Emits when a button/action cell is triggered. */
    cellAction: EventEmitter<JxCellActionEvent<T>>;
    /** Emits the clicked row when `options.selectable` is `true`. */
    rowSelect: EventEmitter<T>;
    private scrollContainerRef?;
    visibleColumns: JxColumn<T>[];
    selectedRowIndex: number | null;
    /** The currently rendered slice of `data`. Equals `data` when virtual scroll is off. */
    virtualRows: T[];
    /** Data index of the first row in `virtualRows`. */
    startIndex: number;
    /** Pixel height of the empty spacer row rendered above the visible slice. */
    paddingTop: number;
    /** Pixel height of the empty spacer row rendered below the visible slice. */
    paddingBottom: number;
    /** `true` when virtual scrolling is active (`options.virtualScroll === true`). */
    get isVirtualScroll(): boolean;
    /**
     * The row slice currently bound to `*ngFor` in the template.
     * - Virtual scroll ON → `virtualRows` (the current window).
     * - Virtual scroll OFF → the full `data` array.
     */
    get visibleRows(): T[];
    /**
     * Maps a local `*ngFor` index (0-based within the rendered slice) to the
     * true index within the full `data` array.
     * When virtual scroll is off this is an identity function.
     *
     * @param localIndex - Index from `*ngFor let i = index`.
     * @returns Absolute data index.
     */
    getActualRowIndex(localIndex: number): number;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    /**
     * Scroll event handler attached to the container element when virtual scroll
     * is active.  Delegates to `updateVirtualWindow()`.
     *
     * @param event - Native DOM scroll event.
     */
    onScroll(event: Event): void;
    /**
     * Recalculates the rendered window based on the current scroll position.
     *
     * **Algorithm:**
     * 1. Determine the first visible row index from `scrollTop / rowH`.
     * 2. Expand by `VIRTUAL_BUFFER` rows on each side.
     * 3. Clamp to `[0, data.length]`.
     * 4. Set `virtualRows` to `data.slice(start, end)`.
     * 5. Set `paddingTop` / `paddingBottom` spacer heights so the total
     *    scrollable height equals `data.length * rowH`.
     *
     * @param scrollTop - Current vertical scroll offset in pixels.
     */
    private updateVirtualWindow;
    getValue(row: T, column: JxColumn<T>): any;
    getColumnWidth(column: JxColumn<T>): string | null;
    getRowHeight(): string | null;
    isEditable(column: JxColumn<T>): boolean;
    getCellClass(column: JxColumn<T>): string;
    getHeaderClass(column: JxColumn<T>): string;
    onCellValueChange(row: T, localIndex: number, column: JxColumn<T>, columnIndex: number, newValue: any): void;
    onCellAction(row: T, localIndex: number, column: JxColumn<T>, columnIndex: number, event: any): void;
    selectRow(row: T, localIndex: number): void;
    trackByRow: (_localIndex: number, row: T) => any;
    trackByColumn: (index: number, column: JxColumn<T>) => any;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxGridComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JxGridComponent<any>, "jx-grid", never, { "data": { "alias": "data"; "required": false; }; "columns": { "alias": "columns"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, { "cellChange": "cellChange"; "cellAction": "cellAction"; "rowSelect": "rowSelect"; }, never, never, false, never>;
}
