import { BehaviorSubject, Subject } from 'rxjs';
import { JxAfterChangesPayload, JxBeforeEditionEndPayload, JxCancellableEvent, JxCellColumn, JxCellOptions, JxCellStyle, JxChangePayload, JxColOpPayload, JxEditionEndPayload, JxEditionStartPayload, JxFooterChangePayload, JxJsonExportOptions, JxMergeInfo, JxMergePayload, JxMoveColPayload, JxMoveRowPayload, JxPastePayload, JxPersistPayload, JxResizeColPayload, JxResizeRowPayload, JxRowOpPayload, JxSelection, JxSortPayload, JxSortState } from '../models/jx-cell.models';
import { JxAddressService } from './jx-address.service';
import { JxFormulaService } from './jx-formula.service';
import * as i0 from "@angular/core";
/**
 * Core state-management service for a single `jx-table` grid instance.
 *
 * `JxWorkbookService` is the single source of truth for all grid data, configuration,
 * selection, styles, merges, history, formula evaluation, search, persistence, and
 * event dispatch.  It is provided **per-component** via the `providers` array of
 * `JxTableComponent`, so every grid instance gets its own isolated workbook.
 *
 * ---
 * **Typical usage** — access via the `ready` output:
 *
 * ```html
 * <jx-table [options]="opts" (ready)="onReady($event)"></jx-table>
 * ```
 * ```typescript
 * onReady(wb: JxWorkbookService) {
 *   wb.setValue('A1', 42);
 *   wb.events.change$.subscribe(e => console.log('changed', e));
 * }
 * ```
 *
 * ---
 * **Key API groups:**
 * - **Data I/O**: `getData()`, `getRawData()`, `getJson()`, `setData()`, `appendData()`, `setValue()`, `setRowData()`, `setColumnData()`
 * - **Rows/Columns**: `insertRow()`, `deleteRow()`, `insertColumn()`, `deleteColumn()`, `moveRow()`, `moveColumn()`
 * - **Selection**: `setSelection()`, `getSelection()`, `getSelectedRows()`, `getHighlighted()`
 * - **Merges**: `setMerge()`, `getMerge()`, `removeMerge()`, `destroyMerged()`
 * - **Styles**: `setCellStyle()`, `setRowStyle()`, `setColumnStyle()`, `getCellStyle()`
 * - **Sort / Search**: `sort()`, `search()`, `setColumnFilter()`
 * - **History**: `undo()`, `redo()`, `canUndo()`, `canRedo()`
 * - **Persistence**: `saveState()`, `clearPersistence()`, `getPersistedData()`
 * - **Visibility**: `hideRow()`, `showRow()`, `hideColumn()`, `showColumn()`
 * - **Comments/Meta**: `getComments()`, `setComments()`, `getMeta()`, `setMeta()`
 * - **Footer**: `getFooters()`, `setFooter()`, `hideFooterRow()`, `toggleFooterGroup()`
 * - **Events**: `workbook.events.*$` — typed RxJS Subjects for every grid event
 */
export declare class JxWorkbookService<T extends Record<string, any> = Record<string, any>> {
    private address;
    private formula;
    private options;
    private rawData;
    private formulas;
    private selection;
    private mergeCells;
    private footerRawData;
    private footerData;
    /** Evaluated column-header titles (formulas resolved). Parallel to options.columns. */
    private evaluatedHeaderTitles;
    /** Evaluated nested-header cell titles (formulas resolved). [rowIndex][cellIndex]. */
    private evaluatedNestedHeaderTitles;
    private undoStack;
    private redoStack;
    private applyingHistory;
    private readonly maxHistoryEntries;
    readonly data$: BehaviorSubject<any[][]>;
    readonly selection$: BehaviorSubject<JxSelection>;
    readonly footers$: BehaviorSubject<any[][]>;
    readonly styles$: BehaviorSubject<void>;
    readonly sort$: BehaviorSubject<JxSortState>;
    /** Set degli indici di riga attualmente nascosti dalla ricerca. Emette ad ogni search()/resetSearch(). */
    readonly search$: BehaviorSubject<Set<number>>;
    /** Set degli indici di riga attualmente nascosti dai filtri di colonna. Emette ad ogni setColumnFilter()/clearColumnFilters(). */
    readonly columnFilter$: BehaviorSubject<Set<number>>;
    /** Current page index (0-based). Emits whenever the page changes. */
    readonly page$: BehaviorSubject<number>;
    private _currentPage;
    private columnFilters;
    private cellStyles;
    private rowStyles;
    private colStyles;
    private headerColStyles;
    private footerCellStyles;
    private footerRowStyles;
    private hiddenFooterRows;
    private nestedHeaderRowStyles;
    private nestedHeaderCellStyles;
    private readonlyCells;
    private readonlyRows;
    private readonlyCols;
    readonly readonly$: BehaviorSubject<void>;
    private hiddenRows;
    private hiddenCols;
    /** Emits whenever hidden-row or hidden-column state changes. */
    readonly visibility$: BehaviorSubject<void>;
    private cellMeta;
    private cellComments;
    /** Emits whenever setComments/clearComments is called. */
    readonly comments$: BehaviorSubject<void>;
    private cellClasses;
    /** Emits whenever addClass/removeClass is called so the template can re-render. */
    readonly cellClasses$: BehaviorSubject<void>;
    private locked;
    readonly locked$: BehaviorSubject<boolean>;
    readonly config$: BehaviorSubject<void>;
    readonly loading$: BehaviorSubject<boolean>;
    private isInitializing;
    /**
     * Typed event bus: subscribe agli Observable per reagire/intercettare ogni evento della griglia
     * senza configurare callbacks nelle options.
     *
     * @example
     * workbook.events.beforeChange$.subscribe(e => {
     *   if (e.data.value === 'vietato') e.cancel();
     * });
     * workbook.events.change$.subscribe(e => console.log('cambiato', e));
     */
    readonly events: {
        readonly beforeChange$: Subject<JxCancellableEvent<JxChangePayload>>;
        readonly beforeInsertRow$: Subject<JxCancellableEvent<JxRowOpPayload>>;
        readonly beforeDeleteRow$: Subject<JxCancellableEvent<JxRowOpPayload>>;
        readonly beforeInsertColumn$: Subject<JxCancellableEvent<JxColOpPayload>>;
        readonly beforeDeleteColumn$: Subject<JxCancellableEvent<JxColOpPayload>>;
        readonly beforeMoveColumn$: Subject<JxCancellableEvent<JxMoveColPayload>>;
        readonly beforeMoveRow$: Subject<JxCancellableEvent<JxMoveRowPayload>>;
        readonly beforePaste$: Subject<JxCancellableEvent<JxPastePayload>>;
        readonly beforeMerge$: Subject<JxCancellableEvent<JxMergePayload>>;
        readonly beforeResizeColumn$: Subject<JxCancellableEvent<JxResizeColPayload>>;
        readonly beforeResizeRow$: Subject<JxCancellableEvent<JxResizeRowPayload>>;
        readonly beforeEditionEnd$: Subject<JxCancellableEvent<JxBeforeEditionEndPayload>>;
        readonly change$: Subject<JxChangePayload>;
        readonly afterChanges$: Subject<JxAfterChangesPayload>;
        readonly insertRow$: Subject<JxRowOpPayload>;
        readonly deleteRow$: Subject<JxRowOpPayload>;
        readonly insertColumn$: Subject<JxColOpPayload>;
        readonly deleteColumn$: Subject<JxColOpPayload>;
        readonly moveColumn$: Subject<JxMoveColPayload>;
        readonly moveRow$: Subject<JxMoveRowPayload>;
        readonly paste$: Subject<JxPastePayload>;
        readonly merge$: Subject<JxMergePayload>;
        readonly resizeColumn$: Subject<JxResizeColPayload>;
        readonly resizeRow$: Subject<JxResizeRowPayload>;
        readonly selection$: Subject<JxSelection>;
        readonly editionStart$: Subject<JxEditionStartPayload>;
        readonly editionEnd$: Subject<JxEditionEndPayload>;
        readonly sort$: Subject<JxSortPayload>;
        readonly footerChange$: Subject<JxFooterChangePayload>;
        readonly persist$: Subject<JxPersistPayload>;
        /** Fired after a successful undo(). */
        readonly undo$: Subject<void>;
        /** Fired after a successful redo(). */
        readonly redo$: Subject<void>;
        /** Fired when a data cell is clicked. */
        readonly click$: Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        /** Fired when a data cell receives focus (starts editing). */
        readonly focus$: Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        /** Fired once after the grid is fully initialised (init() completes). */
        readonly load$: Subject<void>;
        /** Fired when a data cell loses focus (blurs). */
        readonly blur$: Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        /** Fired after a column header title is renamed via setHeader(). */
        readonly changeHeader$: Subject<{
            col: number;
            oldTitle: string;
            newTitle: string;
        }>;
        /** Fired when cell editing is cancelled (Escape key). */
        readonly cancelCell$: Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        /** Fired when destroy() is called. */
        readonly destroy$: Subject<void>;
        /** Fired after setMeta() / updateMeta(). */
        readonly changeMeta$: Subject<{
            cell: string;
            meta: Record<string, any>;
        }>;
        /** Fired after setCellStyle() / setRowStyle() / setColumnStyle() / resetStyle(). */
        readonly changeStyle$: Subject<{
            cells: string[];
        }>;
        /** Fired after copy() or cut(). */
        readonly copy$: Subject<{
            data: any[][];
            cut: boolean;
        }>;
        /** Fired when a selection starts (mousedown / keyboard). */
        readonly selectStart$: Subject<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        }>;
    };
    private persistTimer;
    private searchQuery;
    constructor(address: JxAddressService, formula: JxFormulaService);
    /**
     * Initialises (or re-initialises) the workbook with a new set of options.
     *
     * Called automatically by `JxTableComponent` after the first
     * `ngAfterViewInit` and on every `ngOnChanges` that carries a new `options`
     * reference.  You can also call it imperatively to completely reset the grid.
     *
     * During `init()` all internal state is cleared (undo/redo stacks, styles,
     * selections, search, filters, hidden rows/columns, metadata, comments, and
     * classes) before the new options are applied.
     *
     * @param options - Full `JxCellOptions<T>` configuration object.
     *
     * @example
     * // Re-initialise with new data
     * workbook.init({ columns: myColumns, data: myData });
     */
    init(options: JxCellOptions<T>): void;
    /** Returns the current options object (live reference — mutations are reflected immediately). */
    getOptions(): JxCellOptions<T>;
    /**
     * Chiama il callback catch-all `onevent` e poi il callback specifico `options[eventName]`.
     * Restituisce il valore di ritorno dell'ultimo handler invocato.
     * Usato internamente e dal componente per gli eventi di edition/resize.
     */
    fireEvent(eventName: string, ...args: any[]): any;
    /**
     * Emette un evento cancellabile su `subject`, poi chiama `fireEvent`.
     * Restituisce l'evento con `cancelled` e `result` già valorizzati.
     * Se il callback (o l'old-style option) restituisce `false` → `ev.cancelled = true`.
     * Se restituisce un valore diverso da `undefined/false` → `ev.result = valore`.
     */
    /** @internal Usato dal componente per gli eventi di resize/edition. */
    fireBefore<T>(subject: Subject<JxCancellableEvent<T>>, eventName: string, data: T, ...cbArgs: any[]): JxCancellableEvent<T>;
    /** Emette `data` su `subject` e chiama `fireEvent` per il callback specifico. */
    private fireAfter;
    refresh(): Promise<void>;
    /**
     * Carica i dati da options.csv.
     * Se csv non contiene newline, viene trattato come URL/path da fetchare
     * (assoluto, relativo o data URI); altrimenti come stringa CSV inline.
     */
    loadCsv(): Promise<void>;
    /**
     * Scarica i dati correnti come file CSV.
     * Analogo a jExcel `download(includeHeaders)`.
     */
    download(includeHeaders?: boolean): void;
    /**
     * Parsa una stringa CSV e restituisce un array bidimensionale di stringhe.
     * Compatibile con RFC 4180: gestisce campi quotati, escape delle virgolette
     * e i separatori CRLF / LF / CR.
     * Analogo a jExcel `parseCSV(str, delimiter)`.
     */
    parseCSV(str: string, delimiter?: string): string[][];
    /**
     * Patches the current options without re-initialising the entire grid.
     * Only the properties you pass are changed; everything else remains as-is.
     * Triggers a `config$` emission so the component re-renders.
     *
     * @param patch - A partial `JxCellOptions<T>` object with the properties to update.
     *
     * @example
     * workbook.setConfig({ allowInsertRow: false, stickyFooter: true });
     */
    setConfig(patch: Partial<JxCellOptions<T>>): void;
    /** Imposta l'allineamento testo di una colonna a runtime. */
    setColumnAlign(x: number, align: string): void;
    /**
     * Returns a deep-copy of the current **processed** (formula-evaluated) data
     * as a 2-D array of rows × columns.  Each row is a new array so mutations do
     * not affect the workbook state.
     *
     * @returns Processed 2-D data matrix.
     *
     * @example
     * const matrix = workbook.getData();
     * console.log(matrix[0][0]); // processed value of A1
     */
    getData(): any[][];
    /**
     * Returns a deep-copy of the **raw** (unprocessed) data — formulas are
     * returned as formula strings (e.g. `'=A1+B1'`) rather than their result.
     *
     * @returns Raw 2-D data matrix with formula strings intact.
     *
     * @example
     * const raw = workbook.getRawData();
     * console.log(raw[0][2]); // '=A1+B1' (not the evaluated result)
     */
    getRawData(): any[][];
    /** Returns the number of data rows (fast, no copy). */
    getRowCount(): number;
    /**
     * Exports the grid data as an array of plain objects where each key
     * corresponds to a column's `name`/`field`, or the letter label when
     * no name is configured.
     *
     * @param options - Export options or a boolean shorthand for `processed`.
     *   - `true` (default) — include formula results.
     *   - `false` — include raw formula strings.
     *   - `{ processed?, includeHiddenColumns? }` — fine-grained control.
     * @returns Array of row-objects.
     *
     * @example
     * // Processed (default)
     * workbook.getJson();
     * // → [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
     *
     * // Raw (formula strings)
     * workbook.getJson(false);
     * // → [{ total: '=B1*C1' }, ...]
     *
     * // Include hidden columns
     * workbook.getJson({ processed: true, includeHiddenColumns: true });
     */
    getJson(options?: JxJsonExportOptions | boolean): Record<string, any>[];
    /**
     * Returns one or all rows as plain objects (same shape as `getJson()`).
     *
     * @param rowNumber  - Zero-based row index. Omit to get all rows.
     * @param processed  - When `true` (default) returns evaluated values; `false` returns raw data.
     * @returns A single row object when `rowNumber` is provided, or an array of all row objects.
     *
     * @example
     * workbook.getObject(0);       // { name: 'Alice', age: 30 }
     * workbook.getObject();        // [{ name: 'Alice' }, { name: 'Bob' }]
     * workbook.getObject(1, false); // { formula: '=A2+B2' }
     */
    getObject(rowNumber?: number, processed?: boolean): Record<string, any> | Record<string, any>[];
    /**
     * Returns a copy of a single row as a flat array of cell values.
     *
     * @param rowNumber - Zero-based row index.
     * @param processed - When `true` (default) returns evaluated values.
     * @returns Array of cell values for that row.
     *
     * @example
     * workbook.getRowData(0);       // [1, 'Alice', '=A1+1']  (processed)
     * workbook.getRowData(0, false); // [1, 'Alice', '=A1+1']  (raw formulas)
     */
    getRowData(rowNumber: number, processed?: boolean): any[];
    /**
     * Returns a copy of a single column as a flat array of cell values.
     *
     * @param columnNumber - Zero-based column index.
     * @param processed    - When `true` (default) returns evaluated values.
     * @returns Array of values, one per row.
     *
     * @example
     * workbook.getColumnData(1);       // [20, 30, 40]
     * workbook.getColumnData(2, false); // ['=A1*2', '=A2*2']
     */
    getColumnData(columnNumber: number, processed?: boolean): any[];
    /**
     * Returns the column-header title array as plain strings.
     * Use `getEvaluatedHeaderTitles()` when you need formulas resolved.
     *
     * @returns Array of header title strings, one per column.
     *
     * @example
     * workbook.getHeaders(); // ['Name', 'Age', 'Score']
     */
    getHeaders(): string[];
    /**
     * Returns column-header titles with any formula expressions already resolved.
     * Falls back to the raw title (or letter label) when the title is not a formula.
     * Use this instead of `getHeaders()` when rendering the UI.
     */
    getEvaluatedHeaderTitles(): string[];
    /**
     * Returns the evaluated title for a single column header.
     * Formulas (e.g. `=COUNTA(B:B)`) are resolved; plain strings are returned as-is.
     * Falls back to the letter label when the column has no title.
     */
    getEvaluatedHeaderTitle(x: number): string;
    /**
     * Returns the evaluated title for a nested-header cell.
     * Formulas are resolved against the current grid data.
     * Falls back to the raw `title` string.
     *
     * @param rowIndex - 0-based row index within `nestedHeaders`.
     * @param cellIndex - 0-based cell index within that row.
     */
    getEvaluatedNestedHeaderTitle(rowIndex: number, cellIndex: number): string;
    /**
     * Returns a snapshot of the current configuration, including the latest raw
     * data, footer data, and merge map.
     *
     * @returns A cloned `JxCellOptions<T>` object that can be serialised or
     *          passed back to `init()` to restore the exact current state.
     *
     * @example
     * const snapshot = workbook.getConfig();
     * // Later, restore:
     * workbook.init(snapshot);
     */
    getConfig(): JxCellOptions<T>;
    /**
     * Restituisce il testo UI per la chiave specificata.
     * Se l'opzione `text` non è stata configurata (o la chiave manca), restituisce il valore di default.
     */
    getText(key: keyof import('../models/jx-cell.models').JxCellText): string;
    /**
     * Converte un indice colonna (0-based) nella lettera corrispondente (A, B, … AA, AB, …).
     * Equivale a `JxAddressService.columnName()` esposto come metodo pubblico dell'istanza.
     */
    getColumnName(index: number): string;
    /**
     * Converte il nome lettera di una colonna (A, B, … AA) nel suo indice 0-based.
     */
    getIdFromColumnName(name: string): number;
    /**
     * Restituisce l'indice della colonna (0-based) cercando per `name` o `field`
     * nella definizione delle colonne (`options.columns`).
     * Ritorna -1 se nessuna colonna corrisponde.
     */
    getColumnByKey(key: string): number;
    /**
     * Restituisce la label visibile (display value) di un valore in una colonna dropdown.
     * Se il valore non è trovato nelle `source` della colonna, restituisce il valore grezzo.
     */
    getDropDownValue(col: number, key: any): string;
    /**
     * Returns all processed footer rows as a 2-D array.
     *
     * @param processed - When `true` (default) formulas in footer cells are evaluated.
     * @returns 2-D array of footer cell values (rows × columns).
     *
     * @example
     * workbook.getFooters(); // [['Total', '', '=SUM(C1:C10)']]
     */
    getFooters(processed?: boolean): any[][];
    /**
     * Returns the value of a specific footer cell.
     *
     * @param row       - Zero-based footer row index.
     * @param column    - Zero-based column index.
     * @param processed - When `true` (default) formula values are evaluated.
     * @returns The footer cell value.
     *
     * @example
     * workbook.getFooter(0, 2); // 150  (evaluated SUM formula)
     */
    getFooter(row: number, column: number, processed?: boolean): any;
    /**
     * Updates a single footer cell and fires the `footerChange` event.
     * The change is recorded in the undo stack.
     *
     * @param row    - Zero-based footer row index.
     * @param column - Zero-based column index.
     * @param value  - New cell value (string, number, or formula starting with `=`).
     *
     * @example
     * workbook.setFooter(0, 2, '=SUM(C1:C10)');
     * workbook.setFooter(0, 0, 'Total');
     */
    setFooter(row: number, column: number, value: any): void;
    /**
     * Replaces the entire footer data matrix at once.
     * Automatically normalises row lengths to match the column count.
     *
     * @param footers - 2-D array of footer cell values.
     *
     * @example
     * workbook.setFooters([['Total', '', '=SUM(C1:C10)']]);
     */
    setFooters(footers: any[][]): void;
    /**
     * Hides footer row `fy` (zero-based).  Hidden footer rows are not rendered.
     * Triggers a `footers$` emission so the template re-renders.
     *
     * @param fy - Zero-based footer row index.
     *
     * @example
     * workbook.hideFooterRow(1); // hide second footer row
     */
    hideFooterRow(fy: number): void;
    /**
     * Makes a previously hidden footer row visible again.
     *
     * @param fy - Zero-based footer row index.
     *
     * @example
     * workbook.showFooterRow(1);
     */
    showFooterRow(fy: number): void;
    /**
     * Toggles the visibility of footer row `fy`.
     *
     * @param fy - Zero-based footer row index.
     *
     * @example
     * workbook.toggleFooterRow(2); // hide or show row 2
     */
    toggleFooterRow(fy: number): void;
    /**
     * Returns `true` when footer row `fy` is currently hidden.
     *
     * @param fy - Zero-based footer row index.
     *
     * @example
     * workbook.isFooterRowHidden(1); // true / false
     */
    isFooterRowHidden(fy: number): boolean;
    /**
     * Toggles the visibility of all footer rows **below** `headerFy`.
     * Designed to be called from a collapsible-footer toggle component placed
     * at row `headerFy`.
     *
     * @param headerFy - Zero-based index of the "header" footer row (the toggle row).
     * @returns `true` if the group was just collapsed; `false` if it was expanded.
     *
     * @example
     * // In a footer toggle component
     * const collapsed = workbook.toggleFooterGroup(0);
     * console.log(collapsed ? 'Collapsed' : 'Expanded');
     */
    toggleFooterGroup(headerFy: number): boolean;
    /**
     * Returns `true` when the footer group controlled by `headerFy` is currently collapsed,
     * i.e. the row immediately following `headerFy` is hidden.
     *
     * @param headerFy - Zero-based index of the "header" footer row.
     *
     * @example
     * workbook.isFooterGroupCollapsed(0); // true / false
     */
    isFooterGroupCollapsed(headerFy: number): boolean;
    /**
     * Returns the **processed** (formula-evaluated) value of a cell by address.
     *
     * @param cellName - Cell address string, e.g. `'A1'` or `'B3'`.
     * @returns The evaluated cell value, or `undefined` if the address is invalid.
     *
     * @example
     * workbook.getValue('A1'); // 42
     * workbook.getValue('B2'); // 'hello'
     */
    getValue(cellName: string): any;
    /**
     * Returns the **raw** (unprocessed) value of a cell — formula strings are
     * returned as-is rather than their evaluated result.
     *
     * @param cellName - Cell address string, e.g. `'A1'`.
     * @returns The raw cell value (e.g. `'=A1+B1'`), or `undefined` if the address is invalid.
     *
     * @example
     * // If A1 contains the formula =B1*2
     * workbook.getRawValue('A1'); // '=B1*2'
     * workbook.getValue('A1');    // 84  (evaluated)
     */
    getRawValue(cellName: string): any;
    /** Restituisce una copia immutabile dei valori grezzi della riga `y` (utile nei subscriber degli eventi). */
    getRow(y: number): readonly any[];
    /** Restituisce la definizione della colonna `x` oppure `null` se non configurata. */
    getColumnDef(x: number): JxCellColumn | null;
    /**
     * Sets the value of a single cell, fires before/after change events, and
     * recalculates all formulas.  The change is pushed onto the undo stack.
     *
     * @param cellName - Cell address string, e.g. `'A1'`.
     * @param value    - New value (string, number, boolean, or formula starting with `=`).
     *
     * @example
     * workbook.setValue('A1', 'Hello World');
     * workbook.setValue('B2', 42);
     * workbook.setValue('C3', '=A1+B2');   // formula
     */
    setValue(cellName: string, value: any): void;
    /**
     * Convenience alias for `setValue(cellName, expression)` that makes the
     * intent explicit when assigning a formula string.
     *
     * @param cellName   - Cell address string, e.g. `'C3'`.
     * @param expression - Formula string starting with `=`, e.g. `'=A1+B1'`.
     *
     * @example
     * workbook.setFormula('C3', '=A3*B3');
     */
    setFormula(cellName: string, expression: string): void;
    /**
     * Sets the same value on multiple cells at once.  Fires individual
     * `beforeChange`/`change` events per cell and a single `afterChanges`
     * event at the end.  All changes are recorded as one undo entry.
     *
     * @param cells - Array of cell address strings, e.g. `['A1', 'B1', 'C1']`.
     * @param value - Value to assign to every cell in `cells`.
     *
     * @example
     * workbook.setMultipleCells(['A1', 'A2', 'A3'], 0);
     * workbook.setMultipleCells(['B1', 'B2'], '=A1*2');
     */
    setMultipleCells(cells: string[], value: any): void;
    /**
     * Inserts one or more rows at a given position.
     *
     * @param index   - Zero-based row index at which to insert (default: append to end).
     * @param amount  - Number of rows to insert (default: `1`).
     * @param rowData - Optional default data for the new rows. Can be a flat array
     *                  (positional) or an object keyed by column `name`/`field`.
     *
     * @example
     * // Insert an empty row at position 2
     * workbook.insertRow(2);
     *
     * // Append 3 empty rows at the end
     * workbook.insertRow(undefined, 3);
     *
     * // Insert a pre-filled row at position 0
     * workbook.insertRow(0, 1, { name: 'Alice', age: 30 });
     */
    insertRow(index?: number, amount?: number, rowData?: any[] | Record<string, any>): void;
    /**
     * Deletes one or more rows starting at `index`.
     *
     * @param index  - Zero-based index of the first row to delete.
     * @param amount - Number of rows to delete (default: `1`).
     *
     * @example
     * workbook.deleteRow(0);    // delete row 1
     * workbook.deleteRow(5, 3); // delete rows 6, 7, 8
     */
    deleteRow(index: number, amount?: number): void;
    /**
     * Inserts one or more columns at a given position.
     *
     * @param index        - Zero-based column index (default: append after last column).
     * @param amount       - Number of columns to insert (default: `1`).
     * @param defaultValue - Default cell value for all rows in the new column(s) (default: `''`).
     *
     * @example
     * workbook.insertColumn(2);          // insert empty column at position C
     * workbook.insertColumn(0, 2, '—');  // prepend 2 columns filled with '—'
     */
    insertColumn(index?: number, amount?: number, defaultValue?: string): void;
    /**
     * Deletes one or more columns starting at `index`.
     *
     * @param index  - Zero-based index of the first column to delete.
     * @param amount - Number of columns to delete (default: `1`).
     *
     * @example
     * workbook.deleteColumn(2);    // delete column C
     * workbook.deleteColumn(0, 2); // delete columns A and B
     */
    deleteColumn(index: number, amount?: number): void;
    /**
     * Moves a column from one position to another, updating all internal
     * formula references, merge maps, and the current selection.
     *
     * @param from - Zero-based source column index.
     * @param to   - Zero-based destination column index.
     *
     * @example
     * workbook.moveColumn(0, 3); // move column A to position D
     */
    moveColumn(from: number, to: number): void;
    /**
     * Moves a row from one position to another, updating formula references,
     * merge maps, and the current selection.
     *
     * @param from - Zero-based source row index.
     * @param to   - Zero-based destination row index.
     *
     * @example
     * workbook.moveRow(0, 5); // move first row to position 6
     */
    moveRow(from: number, to: number): void;
    /**
     * Pastes a 2-D block of values starting at cell `(startX, startY)`, applying
     * `beforePaste` / `paste` events and the configured security policies
     * (`stripHTML`, `secureFormulas`, `autoCasting`).
     *
     * @param data   - 2-D array of values to paste (rows × columns).
     * @param startX - Zero-based starting column index.
     * @param startY - Zero-based starting row index.
     *
     * @example
     * workbook.pasteRange([['A', 'B'], ['C', 'D']], 0, 0);
     * // Pastes values into A1:B2
     */
    pasteRange(data: any[][], startX: number, startY: number): void;
    /** Converte stringhe numeriche, booleane e null-like al tipo nativo (usato da autoCasting). */
    private castValue;
    /**
     * Fills cells downward from `(fromX, fromY)` to `(fromX, toY)` by copying
     * and/or incrementing the source value.  Formula row-references are adjusted;
     * numeric sequences are auto-incremented when `autoIncrement` is enabled.
     *
     * @param fromX - Zero-based column index of the source cell.
     * @param fromY - Zero-based row index of the source cell.
     * @param toY   - Zero-based row index of the last target cell.
     *
     * @example
     * // Copy A1 value into A2..A5
     * workbook.fillDown(0, 0, 4);
     */
    fillDown(fromX: number, fromY: number, toY: number): void;
    /**
     * Fills cells to the right from `(fromX, fromY)` to `(toX, fromY)` by
     * copying and/or incrementing the source value.  Formula column-references
     * are adjusted; numeric sequences are auto-incremented when `autoIncrement` is enabled.
     *
     * @param fromX - Zero-based column index of the source cell.
     * @param fromY - Zero-based row index of the source cell.
     * @param toX   - Zero-based column index of the last target cell.
     *
     * @example
     * // Copy B3 rightward into C3..F3
     * workbook.fillRight(1, 2, 5);
     */
    fillRight(fromX: number, fromY: number, toX: number): void;
    fillDownRange(sourceX1: number, sourceX2: number, sourceY1: number, sourceY2: number, toY: number): void;
    fillRightRange(sourceX1: number, sourceX2: number, sourceY1: number, sourceY2: number, toX: number): void;
    private computeRangeFillValue;
    /**
     * Incrementa un valore scalare di `offset` passi.
     * - Numeri puri → aggiunge offset.
     * - Stringhe con numero finale (es. "Item 1", "Q1", "2024-01") → incrementa il numero.
     * - Tutto il resto → copia semplice.
     */
    private autoIncrementValue;
    private positiveModulo;
    private adjustFormulaRowRefs;
    private adjustFormulaColumnRefs;
    /**
     * Programmatically sets (or extends) the cell selection.
     *
     * The selection is automatically expanded when it overlaps with a merged cell
     * so the entire merge region is always included.
     * Fires `selectStart$` when the anchor cell changes and `selection$` on every update.
     *
     * @param sel - Selection rectangle `{ x1, y1, x2, y2 }` using zero-based indices.
     *
     * @example
     * workbook.setSelection({ x1: 0, y1: 0, x2: 2, y2: 3 }); // select A1:C4
     * workbook.setSelection({ x1: 1, y1: 1, x2: 1, y2: 1 }); // select single cell B2
     */
    setSelection(sel: JxSelection): void;
    /**
     * Returns the current selection rectangle, or `null` when nothing is selected.
     *
     * @returns Current `JxSelection` or `null`.
     *
     * @example
     * const sel = workbook.getSelection();
     * if (sel) console.log(`Selected: ${sel.x1},${sel.y1} → ${sel.x2},${sel.y2}`);
     */
    getSelection(): JxSelection | null;
    /** Muove il cursore di una riga in su. Se shift estende la selezione; se ctrl salta alla prima riga. */
    up(shift?: boolean, ctrl?: boolean): void;
    /** Muove il cursore di una riga in giù. Se ctrl salta all'ultima riga. */
    down(shift?: boolean, ctrl?: boolean): void;
    /** Muove il cursore di una colonna a sinistra. Se ctrl salta alla prima colonna. */
    left(shift?: boolean, ctrl?: boolean): void;
    /** Muove il cursore di una colonna a destra. Se ctrl salta all'ultima colonna. */
    right(shift?: boolean, ctrl?: boolean): void;
    /** Salta alla prima cella (A1). */
    first(shift?: boolean, ctrl?: boolean): void;
    /** Salta all'ultima cella (ultima colonna, ultima riga). */
    last(shift?: boolean, ctrl?: boolean): void;
    /** Seleziona tutte le celle del foglio. */
    selectAll(): void;
    /**
     * Returns `true` when there is at least one operation available to undo.
     *
     * @example
     * if (workbook.canUndo()) workbook.undo();
     */
    canUndo(): boolean;
    /**
     * Returns `true` when there is at least one operation available to redo.
     *
     * @example
     * if (workbook.canRedo()) workbook.redo();
     */
    canRedo(): boolean;
    /**
     * Undoes the most recent data-mutation operation, restoring the previous
     * grid state.  Fires the `undo$` event and the legacy `onundo` callback.
     *
     * @returns `true` if an undo entry was available and applied; `false` otherwise.
     *
     * @example
     * workbook.setValue('A1', 999);
     * workbook.undo(); // A1 reverts to its previous value
     */
    undo(): boolean;
    /**
     * Re-applies the most recently undone operation.
     * Fires the `redo$` event and the legacy `onredo` callback.
     *
     * @returns `true` if a redo entry was available and applied; `false` otherwise.
     *
     * @example
     * workbook.undo();
     * workbook.redo(); // brings back the undone change
     */
    redo(): boolean;
    hasMergedCells(): boolean;
    isColumnMerged(columnIndex: number): boolean;
    isRowMerged(rowIndex: number): boolean;
    /**
     * Merges a range of cells starting at `cellName`.
     *
     * - When `cellName` is empty the current selection is used.
     * - Cells with `colspan < 2` and `rowspan < 2` are not merged.
     * - Already-merged cells at the origin are silently skipped.
     * - Merging is guarded by the `beforeMerge` cancellable event.
     *
     * Equivalent to jExcel `setMerge(cellName, colspan, rowspan)`.
     *
     * @param cellName               - Top-left cell address, e.g. `'A1'`.
     * @param colspan                - Number of columns to span.
     * @param rowspan                - Number of rows to span.
     * @param ignoreHistoryAndEvents - Internal flag; skip undo stack and event dispatch.
     *
     * @example
     * workbook.setMerge('A1', 3, 2); // merge A1:C2
     * workbook.setMerge('');          // merge the current selection
     */
    setMerge(cellName: string, colspan?: number, rowspan?: number, ignoreHistoryAndEvents?: boolean): void;
    /**
     * Returns the merge info for one cell or all merges.
     *
     * - `getMerge('A1')` → `[colspan, rowspan]` or `null`
     * - `getMerge()` → `{ A1: [colspan, rowspan], … }`
     *
     * Equivalent to jExcel `getMerge(cellName?)`.
     *
     * @param cellName - Optional cell address.
     * @returns Merge dimensions for the given cell, or the full merge map.
     *
     * @example
     * workbook.getMerge('A1');  // [3, 2]
     * workbook.getMerge();      // { A1: [3, 2], D5: [2, 1] }
     */
    getMerge(cellName?: string): Record<string, [number, number]> | [number, number] | null;
    /**
     * Removes the merge at `cellName`, restoring covered cells to their
     * previous values.
     *
     * @param cellName    - Top-left cell address of the merge to remove.
     * @param data        - Optional array of values to restore into the uncovered cells.
     * @param keepOptions - When `true` the merge entry is not deleted from the
     *                      options object (used internally during snapshot restore).
     *
     * @example
     * workbook.removeMerge('A1');
     */
    removeMerge(cellName: string, data?: any[], keepOptions?: boolean): void;
    private removeMergeInternal;
    /**
     * Removes **all** merges in the workbook, restoring every covered cell.
     *
     * @param keepOptions - When `true` the merge map is not cleared in `options`.
     *
     * @example
     * workbook.destroyMerged();
     */
    destroyMerged(keepOptions?: boolean): void;
    /**
     * Returns `true` when the cell at `(x, y)` is the **origin** (top-left corner)
     * of a merge, i.e. it has an entry in the merge map.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     *
     * @example
     * workbook.setMerge('A1', 3, 2);
     * workbook.isMergeOrigin(0, 0); // true  — A1 is the origin
     * workbook.isMergeOrigin(1, 0); // false — B1 is covered, not the origin
     */
    isMergeOrigin(x: number, y: number): boolean;
    /**
     * Returns `true` when the cell at `(x, y)` is **covered** by a merge but is
     * not the merge origin itself.  Covered cells are hidden in the rendered grid.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     *
     * @example
     * workbook.setMerge('A1', 2, 2);
     * workbook.isCoveredByMerge(1, 0); // true  — B1 is covered
     * workbook.isCoveredByMerge(0, 0); // false — A1 is the origin
     */
    isCoveredByMerge(x: number, y: number): boolean;
    /**
     * Returns the merge information for the merge that contains cell `(x, y)`,
     * regardless of whether `(x, y)` is the origin or a covered cell.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     * @returns `JxMergeInfo` describing the merge, or `null` if the cell is not merged.
     *
     * @example
     * workbook.setMerge('A1', 3, 2);
     * workbook.getMergeAt(1, 0);
     * // → { cellName: 'A1', x: 0, y: 0, colspan: 3, rowspan: 2 }
     */
    getMergeAt(x: number, y: number): JxMergeInfo | null;
    /**
     * Re-evaluates all formula cells (up to 3 passes for chained references)
     * and pushes the new processed data to `data$`.  Also re-evaluates footer
     * formulas, column-header titles, and nested-header titles.
     *
     * This is called automatically after every mutation.  You only need to call
     * it manually if you have mutated `rawData` through a non-standard path.
     *
     * @example
     * // After a bulk external mutation:
     * workbook.recalculateAll();
     */
    recalculateAll(): void;
    private schedulePersist;
    private loadPersistedData;
    /**
     * Salva immediatamente i dati correnti in localStorage.
     * Chiamato automaticamente ad ogni modifica se `options.persistence` è impostata.
     * Corrisponde a `save()` di jExcel.
     */
    saveState(): void;
    /**
     * Rimuove i dati salvati da localStorage per la chiave di persistenza corrente.
     */
    clearPersistence(): void;
    /**
     * Restituisce i dati attualmente salvati in localStorage per la chiave di persistenza.
     * Ritorna null se non esiste nulla o la chiave non è configurata.
     */
    getPersistedData(): any[][] | null;
    /**
     * Performs a full-text search across all cell values, hiding rows that do
     * not contain `query`.  Hidden row indices are emitted via `search$`.
     *
     * The search is case-insensitive and works on processed (formula-evaluated)
     * cell values.
     *
     * @param query - Text to search for. Pass an empty string to show all rows.
     *
     * @example
     * workbook.search('alice');   // hides rows that don't contain 'alice'
     * workbook.search('');        // clears search, shows all rows
     */
    search(query: string): void;
    /**
     * Clears the current search query and makes all rows visible again.
     * Equivalent to jExcel `resetSearch()`.
     *
     * @example
     * workbook.resetSearch();
     */
    resetSearch(): void;
    /**
     * Returns the current search query string.
     *
     * @returns The active search query, or an empty string when no search is active.
     *
     * @example
     * workbook.search('alice');
     * workbook.getSearchQuery(); // 'alice'
     */
    getSearchQuery(): string;
    /**
     * Applies a text filter to the specified column.  Rows where the cell in
     * `col` does not contain `value` (case-insensitive) are hidden via `columnFilter$`.
     *
     * Pass an empty string or `null` to remove the filter for that column.
     *
     * @param col   - Zero-based column index.
     * @param value - Filter text.  Empty/null removes the filter.
     *
     * @example
     * workbook.setColumnFilter(1, 'alice'); // show only rows where col B contains 'alice'
     * workbook.setColumnFilter(1, '');      // remove filter from col B
     */
    setColumnFilter(col: number, value: string): void;
    /**
     * Returns the current filter value for a specific column.
     *
     * @param col - Zero-based column index.
     * @returns The active filter string, or empty string if no filter is set.
     *
     * @example
     * workbook.getColumnFilter(2); // 'alice'
     */
    getColumnFilter(col: number): string;
    /**
     * Removes all column filters and makes all rows visible again.
     *
     * @example
     * workbook.clearColumnFilters();
     */
    clearColumnFilters(): void;
    /**
     * Returns a copy of the current column filter map (`column index → filter string`).
     *
     * @returns A new `Map<number, string>` with all active filters.
     *
     * @example
     * workbook.getColumnFilters(); // Map { 1 => 'alice', 3 => 'active' }
     */
    getColumnFilters(): Map<number, string>;
    private applyColumnFilters;
    /**
     * Emette un evento custom sull'elemento host della griglia (bubbles + composed).
     * Equivalente al metodo `dispatch` di jExcel.
     * @param eventName Nome dell'evento DOM custom da emettere.
     * @param detail    Payload opzionale accessibile via event.detail.
     * @param element   Elemento DOM su cui dispatchare (default: document). Normalmente
     *                  il componente passa il proprio nativeElement.
     */
    dispatch(eventName: string, detail?: any, element?: EventTarget): void;
    /**
     * Se `options.autoAddRow` è attivo, verifica che tutte le righe abbiano almeno una
     * cella popolata: in quel caso aggiunge silenziosamente una riga vuota in coda.
     * Non registra la riga nello stack di undo/redo.
     */
    private checkAutoAddRow;
    private padToMinRows;
    /**
     * Garantisce che le righe abbiano almeno (colonne_dati + minSpareCols) colonne.
     * Aggiunge colonne vuote ai dati esistenti e all'options.columns.
     */
    private padToMinSpareCols;
    /**
     * Unisce i legacy arrays (colHeaders, colWidths, colAlignments) nell'array columns[].
     * Chiamato prima di normalizeData in init().
     */
    private applyLegacyColumnArrays;
    private normalizeData;
    private normalizeRow;
    private defaultValueForColumn;
    private defaultFormulaForColumn;
    private getColumnCount;
    /** Racchiude un valore in virgolette CSV se contiene il delimitatore, newline o virgolette. */
    private csvEscape;
    private isColumnPartOfMerge;
    private isRowPartOfMerge;
    private rewriteFormulasForMovedColumn;
    private rewriteFormulasForMovedRow;
    private rewriteFormulaColumnRefs;
    private rewriteFormulaRowRefs;
    private columnLettersToIndex;
    private remapMergesAfterColumnMove;
    private remapSelectionAfterColumnMove;
    private remapSelectionAfterRowMove;
    private remapColumnIndexAfterMove;
    private remapRowIndexAfterMove;
    private remapMergesAfterRowMove;
    private ensureSize;
    private parseValueForColumn;
    private normalizeFooters;
    private rebuildFormulaIndex;
    private syncFormulaIndex;
    private normalizeMergeMap;
    private expandSelectionForMerge;
    private shiftMergesForRowInsert;
    private shiftMergesForRowDelete;
    private shiftMergesForColumnInsert;
    private shiftMergesForColumnDelete;
    /**
     * Pads every row in nestedHeaders so that the sum of all colspan values equals
     * the total column count.  Rows that already cover all columns are left untouched.
     * Rows with MORE colspan than columns are also left untouched (edge case).
     */
    private normalizeNestedHeaders;
    private updateNestedHeadersOnColumnInsert;
    private recordHistory;
    private captureSnapshot;
    private applySnapshot;
    private cloneMergeMap;
    private cloneNestedHeaders;
    /** Returns true if the column is sortable (column-level overrides global option).
     *
     * @param columnIndex - Zero-based column index.
     * @returns `true` if sorting is enabled for the column.
     */
    isColumnSortable(columnIndex: number): boolean;
    /**
     * Returns the current sort state (which column is sorted and in which direction),
     * or `null` when the grid is in its original unsorted order.
     *
     * @returns Current `JxSortState` or `null`.
     *
     * @example
     * workbook.getSortState(); // { columnIndex: 2, direction: 'asc' }
     */
    getSortState(): JxSortState | null;
    /**
     * Sorts the grid by the specified column, cycling through asc → desc → unsorted
     * when called repeatedly on the same column.
     *
     * - Same column: cycles `asc` → `desc` → `null` (original order restored).
     * - Different column: always starts with `'asc'`.
     * - `direction` overrides the cycle when provided explicitly.
     *
     * @param columnIndex - Zero-based column index to sort by.
     * @param direction   - Force a specific direction: `'asc'`, `'desc'`, or `null` to reset.
     *
     * @example
     * workbook.sort(1);          // sort column B ascending
     * workbook.sort(1);          // sort column B descending
     * workbook.sort(1);          // restore original order
     * workbook.sort(2, 'desc'); // force column C descending
     */
    sort(columnIndex: number, direction?: 'asc' | 'desc' | null): void;
    /**
     * Resets sort and restores the original row order.
     *
     * @example
     * workbook.clearSort();
     */
    clearSort(): void;
    private defaultCompareCells;
    /** Set or merge style properties on a single cell (e.g. "A1"). */
    setCellStyle(cellName: string, style: JxCellStyle): void;
    /** Set or merge style properties on every cell in a row (0-based index). */
    setRowStyle(row: number, style: JxCellStyle): void;
    /** Set or merge style properties on every cell in a column (0-based index). */
    setColumnStyle(col: number, style: JxCellStyle): void;
    /**
     * Resolve the effective style for a cell at (x, y).
     * Priority: cell-specific > row > column.
     */
    getCellStyle(x: number, y: number): JxCellStyle | null;
    getCellStyle(cellName: string): JxCellStyle | null;
    /** Remove all style overrides from a specific cell. */
    clearCellStyle(cellName: string): void;
    /** Remove all style overrides from a row. */
    clearRowStyle(row: number): void;
    /** Remove all style overrides from a column. */
    clearColumnStyle(col: number): void;
    /** Remove every style override in the workbook (data cells only). */
    clearAllStyles(): void;
    /** Set or merge style on a column header cell (0-based column index). */
    setHeaderColumnStyle(col: number, style: JxCellStyle): void;
    /** Get current style for a column header. */
    getHeaderColumnStyle(col: number): JxCellStyle | null;
    /** Remove style overrides from a column header. */
    clearHeaderColumnStyle(col: number): void;
    /** Set or merge style on a single footer cell (x = column, y = footer row, both 0-based). */
    setFooterCellStyle(x: number, y: number, style: JxCellStyle): void;
    /** Set or merge style on every cell in a footer row (0-based footer row index). */
    setFooterRowStyle(row: number, style: JxCellStyle): void;
    /**
     * Resolve effective style for a footer cell.
     * Priority: cell-specific > footer row.
     */
    getFooterCellStyleData(x: number, y: number): JxCellStyle | null;
    /** Remove all custom styles from a footer cell. */
    clearFooterCellStyle(x: number, y: number): void;
    /** Remove all custom styles from a footer row. */
    clearFooterRowStyle(row: number): void;
    /** Remove every header and footer style override. */
    clearAllHeaderFooterStyles(): void;
    /** Set or merge style on an entire nested header row (0-based row index). */
    setNestedHeaderRowStyle(row: number, style: JxCellStyle): void;
    /**
     * Set or merge style on a specific nested header cell.
     * @param row  0-based nested header row index
     * @param cellIndex  0-based cell index within that row
     */
    setNestedHeaderCellStyle(row: number, cellIndex: number, style: JxCellStyle): void;
    /**
     * Resolve effective style for a nested header cell.
     * Priority: cell-specific > row.
     */
    getNestedHeaderCellStyleData(row: number, cellIndex: number): JxCellStyle | null;
    /** Remove style overrides from a specific nested header cell. */
    clearNestedHeaderCellStyle(row: number, cellIndex: number): void;
    /** Remove style overrides from an entire nested header row. */
    clearNestedHeaderRowStyle(row: number): void;
    /** Mark a single cell as readonly without changing its appearance. Pass false to un-mark. */
    setCellReadonly(cellName: string, value?: boolean): void;
    /** Mark every cell in a row (0-based) as readonly without changing its appearance. */
    setRowReadonly(row: number, value?: boolean): void;
    /** Mark every cell in a column (0-based) as readonly without changing its appearance. */
    setColumnReadonly(col: number, value?: boolean): void;
    /** Check whether a cell is marked readonly via the API (no visual change). */
    isCellReadonly(x: number, y: number): boolean;
    /** Clear all readonly overrides (does not affect column-config readonly). */
    clearAllReadonly(): void;
    /**
     * Locks or unlocks the entire workbook.
     *
     * When locked, **all** data mutations are silently blocked — including
     * programmatic calls (`setValue`, `setData`, `appendData`, `insertRow`, etc.)
     * and UI editing.  Styles, readonly marks, and sort state remain writable.
     *
     * @param value - `true` to lock; `false` to unlock.
     *
     * @example
     * workbook.setLocked(true);   // prevent all edits
     * workbook.setLocked(false);  // allow edits again
     */
    setLocked(value: boolean): void;
    /**
     * Returns `true` when the workbook is currently locked.
     *
     * @example
     * workbook.isLocked(); // true / false
     */
    isLocked(): boolean;
    /**
     * Replaces the grid data entirely.  Accepts either a 2-D array (positional
     * values) or an array of objects (keyed by column `name`/`field`).
     *
     * Unlike `init()` this method does **not** reset styles, merges, or other
     * configuration — only the data rows are replaced.
     *
     * @param data - New data, as `any[][]` (rows × columns) or `Record<string, any>[]`.
     *
     * @example
     * workbook.setData([[1, 'Alice'], [2, 'Bob']]);
     * workbook.setData([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
     */
    setData(data: any[][] | Record<string, any>[]): void;
    /**
     * Removes all data rows.  When `minRows` is configured the grid is refilled
     * with empty rows up to the minimum count.
     *
     * @example
     * workbook.deleteAll();
     */
    deleteAll(): void;
    /**
     * Appends rows to the existing data without replacing it.
     * Accepts the same formats as `setData()` (2-D array or array of objects).
     *
     * @param data - Rows to append, as `any[][]` or `Record<string, any>[]`.
     *
     * @example
     * workbook.appendData([[3, 'Charlie'], [4, 'Diana']]);
     */
    appendData(data: any[][] | Record<string, any>[]): void;
    /**
     * Replaces all values in a row at `rowIndex`.
     * Equivalent to jExcel `setRowData(rowNumber, data)`.
     *
     * @param rowIndex - Zero-based row index.
     * @param data     - Flat array of values (positional, one per column).
     *
     * @example
     * workbook.setRowData(0, [1, 'Updated Name', 42]);
     */
    setRowData(rowIndex: number, data: any[]): void;
    /**
     * Replaces all values in a column at `colIndex`.
     * Equivalent to jExcel `setColumnData(columnNumber, data)`.
     *
     * @param colIndex - Zero-based column index.
     * @param data     - Array of values, one per row (positional).
     *
     * @example
     * workbook.setColumnData(1, ['Alice', 'Bob', 'Charlie']);
     */
    setColumnData(colIndex: number, data: any[]): void;
    /**
     * Returns the processed display value for a cell by address.
     * Equivalent to jExcel `getLabel(cellName)`.
     *
     * @param cellName - Cell address string, e.g. `'A1'`.
     * @returns Evaluated cell value (formula results, not raw formulas).
     *
     * @example
     * workbook.getLabel('C3'); // 150  (evaluated =A3*B3)
     */
    getLabel(cellName: string): any;
    /**
     * Returns the processed display value for a cell by zero-based coordinates.
     * Equivalent to jExcel `getLabelFromCoords(x, y)`.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     * @returns Evaluated cell value.
     *
     * @example
     * workbook.getLabelFromCoords(2, 0); // same as getLabel('C1')
     */
    getLabelFromCoords(x: number, y: number): any;
    /**
     * Returns the current pixel width of column `col` (reading from `options.columns[col].width`).
     * Equivalent to jExcel `getWidth(col)`.
     *
     * @param col - Zero-based column index.
     * @returns Column width in pixels.
     *
     * @example
     * workbook.getWidth(0); // 150
     */
    getWidth(col: number): number;
    /**
     * Sets the pixel width of column `col` and triggers a config refresh.
     * Equivalent to jExcel `setWidth(col, width)`.
     *
     * @param col   - Zero-based column index.
     * @param width - New width in pixels (minimum enforced: 40 px).
     *
     * @example
     * workbook.setWidth(2, 200); // set column C to 200 px wide
     */
    setWidth(col: number, width: number): void;
    /**
     * Sets the pixel height of row `row` and triggers a config refresh.
     * The component synchronises its `rowHeights` map on the next `config$` emission.
     * Equivalent to jExcel `setHeight(row, height)`.
     *
     * @param row    - Zero-based row index.
     * @param height - New height in pixels (minimum enforced: 22 px).
     *
     * @example
     * workbook.setHeight(0, 60); // make first row 60 px tall
     */
    setHeight(row: number, height: number): void;
    /**
     * Returns the current pixel height of row `row`.
     * Equivalent to jExcel `getHeight(row)`.
     *
     * @param row - Zero-based row index.
     * @returns Row height in pixels.
     *
     * @example
     * workbook.getHeight(0); // 28
     */
    getHeight(row: number): number;
    /** @internal used by the component to sync rowHeights on init/config change */
    _rowHeightOverrides: Map<number, number> | undefined;
    /**
     * Hides a row by its zero-based index.  The row is excluded from rendering
     * (effectively `display: none`).
     * Equivalent to jExcel `hideRow(rowNumber)`.
     *
     * @param row - Zero-based row index.
     *
     * @example
     * workbook.hideRow(2); // hide the third row
     */
    hideRow(row: number): void;
    /**
     * Makes a previously hidden row visible again.
     * Equivalent to jExcel `showRow(rowNumber)`.
     *
     * @param row - Zero-based row index.
     *
     * @example
     * workbook.showRow(2);
     */
    showRow(row: number): void;
    /**
     * Returns `true` if the row is currently hidden via `hideRow()`.
     *
     * @param row - Zero-based row index.
     */
    isRowHidden(row: number): boolean;
    /**
     * Returns a copy of the set of currently hidden row indices.
     *
     * @returns `Set<number>` of zero-based hidden row indices.
     */
    getHiddenRows(): Set<number>;
    /**
     * Hides a column by its zero-based index.  The column is excluded from rendering.
     * Equivalent to jExcel `hideColumn(col)`.
     *
     * @param col - Zero-based column index.
     *
     * @example
     * workbook.hideColumn(3); // hide column D
     */
    hideColumn(col: number): void;
    /**
     * Makes a previously hidden column visible again.
     * Equivalent to jExcel `showColumn(col)`.
     *
     * @param col - Zero-based column index.
     *
     * @example
     * workbook.showColumn(3);
     */
    showColumn(col: number): void;
    /** Returns true if the column is currently hidden via hideColumn(). */
    isColHidden(col: number): boolean;
    /** Returns a copy of the set of currently hidden column indices. */
    getHiddenColumns(): Set<number>;
    /**
     * Returns an array of unique row indices that are included in the current selection.
     * Equivalent to jExcel `getSelectedRows(asArray?)`.
     */
    getSelectedRows(): number[];
    /**
     * Returns an array of unique column indices that are included in the current selection.
     * Equivalent to jExcel `getSelectedColumns()`.
     */
    getSelectedColumns(): number[];
    /**
     * Returns an array of cell names (e.g. ['A1','B1']) currently highlighted/selected.
     * Equivalent to jExcel `getHighlighted()`.
     */
    getHighlighted(): string[];
    /**
     * Changes the title of a column header at runtime.
     * Equivalent to jExcel `setHeader(col, title)`.
     */
    setHeader(col: number, title: string): void;
    /**
     * Returns the current title of the column header.
     * Equivalent to jExcel `getHeader(col)`.
     */
    getHeader(col: number): string;
    /**
     * Returns metadata for a cell or all cells.
     * - `getMeta('A1')` → the meta object for A1
     * - `getMeta()` → all meta as `{ A1: {...}, B2: {...}, ... }`
     * Equivalent to jExcel `getMeta(cellName?)`.
     */
    getMeta(cellName?: string): Record<string, any> | null;
    /**
     * Sets metadata on one or more cells.
     * - `setMeta('A1', { tooltip: 'hello' })` → single cell
     * - `setMeta({ A1: { tooltip: 'hello' }, B2: { note: 'test' } })` → bulk
     * Equivalent to jExcel `setMeta(cellName, key?, value?)`.
     */
    setMeta(cellNameOrMap: string | Record<string, Record<string, any>>, value?: Record<string, any>): void;
    /**
     * Removes all metadata for a cell, or clears all metadata.
     */
    clearMeta(cellName?: string): void;
    /**
     * Returns the computed style of a cell (merged from col style, row style, cell style).
     * Equivalent to jExcel `getStyle(cellName)`.
     */
    getStyle(cellName: string): Partial<CSSStyleDeclaration> | null;
    /**
     * Get the processed value of a cell by zero-based coordinates.
     * Equivalent to jExcel `getValueFromCoords(x, y)`.
     */
    getValueFromCoords(x: number, y: number): any;
    /**
     * Hide the row-number index column.
     * Equivalent to jExcel `hideIndex()`.
     */
    hideIndex(): void;
    /**
     * Show the row-number index column.
     * Equivalent to jExcel `showIndex()`.
     */
    showIndex(): void;
    /**
     * Clear the current cell selection.
     * Equivalent to jExcel `resetSelection()`.
     */
    resetSelection(): void;
    /**
     * Returns true if a cell is marked as readonly (via API or column definition).
     * Equivalent to jExcel `isReadOnly(cell)`.
     */
    isReadOnly(cellName: string): boolean;
    /**
     * Get the comment for a cell (or all comments).
     * Equivalent to jExcel `getComments(cell?)`.
     */
    getComments(cellName?: string): string | Record<string, string> | null;
    /**
     * Set (or remove) a comment on a cell.
     * Pass an empty string or null to remove the comment.
     * Equivalent to jExcel `setComments(cell, comment)`.
     */
    setComments(cellName: string, comment: string | null): void;
    /**
     * Remove the comment from a cell, or clear all comments.
     */
    clearComments(cellName?: string): void;
    /**
     * Add a CSS class to a cell.
     * Equivalent to jExcel `addClass(cellName, className)`.
     */
    addClass(cellName: string, className: string): void;
    /**
     * Remove a CSS class from a cell (or all classes if className is omitted).
     * Equivalent to jExcel `removeClass(cellName, className)`.
     */
    removeClass(cellName: string, className?: string): void;
    /**
     * Returns the extra CSS classes assigned to a cell via `addClass()`.
     */
    getClasses(cellName: string): string[];
    /**
     * Returns the extra CSS classes for a cell at given coordinates.
     */
    getClassesFromCoords(x: number, y: number): string[];
    /**
     * Clear all style from a cell (or clear the entire style map if no cell given).
     * Equivalent to jExcel `resetStyle(cell?)`.
     */
    resetStyle(cellName?: string): void;
    /**
     * Copy the current selection to the system clipboard as tab-delimited text.
     * Equivalent to jExcel `copy(cut?)`.
     */
    copy(cut?: boolean): Promise<void>;
    /**
     * Returns the column definition for a column index.
     * Alias for `getColumnDef`. Equivalent to jExcel `getColumnOptions(col)`.
     */
    getColumnOptions(col: number): JxCellColumn | null;
    /**
     * Returns a JSON object for a single row (by 1-based row number).
     * Alias for `getObject(rowNumber)`. Equivalent to jExcel `getJsonRow(row)`.
     */
    getJsonRow(rowNumber: number): Record<string, any>;
    /**
     * Returns true if any cell in `col` participates in a merge.
     * Alias for `isColumnMerged`. Equivalent to jExcel `isColMerged(col)`.
     */
    isColMerged(col: number): boolean;
    /**
     * Alias for `sort(col, dir)`. Equivalent to jExcel `orderBy(col, asc)`.
     */
    orderBy(col: number, asc?: boolean | 'asc' | 'desc' | null): void;
    /**
     * Re-emits the current selection so the view re-renders highlight state.
     * Equivalent to jExcel `refreshSelection()`.
     */
    refreshSelection(): void;
    /**
     * Toggle global editable state. `false` = all cells read-only.
     * Equivalent to jExcel `setReadOnly(value)`.
     */
    setReadOnly(value: boolean): void;
    /**
     * Set the value of a checkbox / radio cell by coordinates.
     * Equivalent to jExcel `setCheckRadioValue(x, y, value)`.
     */
    setCheckRadioValue(x: number, y: number, value: boolean | string): void;
    /**
     * Update (merge) metadata for a cell.
     * Equivalent to jExcel `updateMeta(cellName, meta)`.
     */
    updateMeta(cellName: string, meta: Record<string, any>): void;
    /**
     * Parse a raw value into a number (locale-aware).
     * Equivalent to jExcel `parseNumber(value, column?)`.
     */
    parseNumber(value: any): number;
    /**
     * Parse a raw string into the appropriate type for a column.
     * Equivalent to jExcel `parseValue(value, col?)`.
     */
    parseValue(value: any, col?: number): any;
    /**
     * Returns the total pixel width of the frozen columns area.
     * Equivalent to jExcel `getFreezeWidth()`.
     */
    getFreezeWidth(): number;
    /**
     * Generate a simple numeric hash of the current data.
     * Equivalent to jExcel `hash()`.
     */
    hash(): number;
    /**
     * Insert multiple rows at a given position with pre-filled data.
     * Equivalent to jExcel `injectArray(x, y, data[])`.
     */
    injectArray(x: number, y: number, data: any[][]): void;
    /**
     * jExcel compat: set cell style via CSS-property-keyed object.
     * Delegates to `setCellStyle`. Cell can be a name ("A1") or "x,y" format.
     */
    setStyle(cellName: string, style: Record<string, string>): void;
    /**
     * jExcel compat: convert a zero-based column index to an alphabetic label (0→"A", 1→"B"...).
     * Alias for `getColumnName`.
     */
    getColumnNameFromId(index: number): string;
    /**
     * jExcel compat: get the processed cell value from zero-based coordinates.
     * Alias for `getValueFromCoords(x, y)`.
     */
    getCellFromCoords(x: number, y: number): any;
    /**
     * jExcel compat: activate the column filter UI for a given column.
     * In jx-cell, column filtering is handled by `setColumnFilter`; this
     * is a no-op kept for API compatibility.
     */
    openFilter(_col?: number): void;
    /**
     * jExcel compat: clear all column filters.
     * Alias for `clearColumnFilters()`.
     */
    resetFilters(): void;
    /**
     * jExcel compat: trigger a persistence save.
     * Alias for `saveState()`.
     */
    save(): void;
    /**
     * Destroy the workbook: clears all data, resets state, and emits `destroy$`.
     * After calling this, `init()` must be called again before the grid is usable.
     */
    destroy(): void;
    /**
     * jExcel compat: update selection to a rectangle defined by two corners.
     * Delegates to `setSelection`.
     */
    updateSelectionFromCoords(x1: number, y1: number, x2?: number, y2?: number): void;
    /**
     * jExcel compat pagination stub: returns the current page index (always 0,
     * pagination is not yet implemented in jx-cell).
     */
    whichPage(): number;
    /** Returns the total number of pages given the current `pagination` option and row count. */
    getPageCount(): number;
    /** Returns the page size (rows per page) from options, or 0 if pagination is disabled. */
    getPageSize(): number;
    /** Returns [firstRowIndex, lastRowIndex] (inclusive, 0-based) for the current page. */
    getPageRange(): [number, number];
    /**
     * Navigate to page `n` (0-based). Clamps to valid range.
     * Fires `onchangepage` and emits `page$`.
     */
    page(n?: number): void;
    /** Alias for `page(n)`. */
    loadPage(n: number): void;
    /** Navigate to the previous page (if any). */
    loadUp(): void;
    /** Navigate to the next page (if any). */
    loadDown(): void;
    /** Re-emit page$ to force the component to re-evaluate visible rows. */
    updatePagination(): void;
    /**
     * Ensure the current selection is within the visible rows of the current page.
     * If not, move it to the first cell of the current page.
     */
    conditionalSelectionUpdate(): void;
    /**
     * jExcel compat: clear all column filters.
     * Alias for `clearColumnFilters()`.
     */
    closeFilter(): void;
    /**
     * jExcel compat: register custom translation strings.
     * Stores the dictionary and merges it into the `text` option so
     * `getText(key)` returns the translated value.
     */
    setDictionary(dict: Partial<import('../models/jx-cell.models').JxCellText>): void;
    /**
     * jExcel compat: register formula/UI extensions (no-op stub).
     * Extensions are already loaded globally via imports; this is kept
     * for API compatibility with jExcel integrations.
     */
    setExtensions(_extensions: Record<string, any>): void;
    /**
     * jExcel compat: manually push a history snapshot onto the undo stack.
     * `data` can be the current rawData state to snapshot (before/after are set to the same value,
     * since this is called externally without a "before" state).
     */
    setHistory(data?: any[][]): void;
    /**
     * Evaluate a formula expression in the context of the current grid data.
     * Equivalent to jExcel `executeFormula(expression)`.
     */
    executeFormula(expression: string): any;
    /**
     * Format a number as a zero-padded 2-digit string.
     * Equivalent to jExcel `doubleDigitFormat(n)` (used for dates/times).
     */
    doubleDigitFormat(n: number): string;
    /**
     * Returns true if the character is a valid alphabetic letter (A-Z, a-z).
     * Equivalent to jExcel `validLetter(c)` (used for cell name parsing).
     */
    validLetter(c: string): boolean;
    private didSnapshotChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxWorkbookService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JxWorkbookService<any>>;
}
