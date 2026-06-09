import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, SimpleChanges, TemplateRef } from '@angular/core';
import { JxAutocompleteItem, JxCellColumn, JxCellOptions, JxContextMenuContext, JxFooterCellContext, JxHeaderCellContext, JxNestedHeaderCellContext, JxSelection, JxCustomCellContext } from '../../models/jx-cell.models';
import { JxAddressService } from '../../services/jx-address.service';
import { JxClipboardService } from '../../services/jx-clipboard.service';
import { JxWorkbookService } from '../../services/jx-workbook.service';
import * as i0 from "@angular/core";
/**
 * Main spreadsheet component. Drop this into any template to render a fully
 * featured interactive data grid backed by `JxWorkbookService`.
 *
 * ```html
 * <jx-spreadsheet [options]="gridOptions" (ready)="onReady($event)"></jx-spreadsheet>
 * ```
 *
 * The component creates a **private** `JxWorkbookService` instance per grid
 * via its `providers` array.  Use the `ready` output to get the workbook
 * reference and interact with the grid programmatically.
 *
 * @template T  Shape of each row object (used for typed `getJson()`/`getObject()` results).
 */
export declare class JxSpreadsheetComponent<T extends Record<string, any> = Record<string, any>> implements AfterViewInit, OnChanges, OnDestroy {
    workbook: JxWorkbookService<T>;
    address: JxAddressService;
    private clipboard;
    private cdr;
    private zone;
    /**
     * Grid configuration object.  All column definitions, data, callbacks,
     * and feature toggles are set here.
     *
     * @example
     * this.gridOptions = {
     *   columns: [{ title: 'Name', name: 'name' }, { title: 'Age', name: 'age', type: 'numeric' }],
     *   data: [['Alice', 30], ['Bob', 25]],
     *   allowInsertRow: true,
     *   onchange: (wb, el, x, y, v) => console.log('changed', x, y, v),
     * };
     */
    options: JxCellOptions<T>;
    /**
     * Emits once after the grid is fully initialised (and again on every
     * `ngOnChanges` that replaces the `options` reference).
     *
     * The emitted value is the `JxWorkbookService` instance for this grid.
     * Use it to read/write data, subscribe to events, and call any workbook API.
     *
     * @example
     * onReady(workbook: JxWorkbookService) {
     *   workbook.setValue('A1', 'Hello');
     *   workbook.events.change$.subscribe(e => console.log(e));
     * }
     */
    ready: EventEmitter<JxWorkbookService<T>>;
    /**
     * Emits whenever the cell selection changes.
     * The payload is the new `JxSelection` rectangle, or `null` when the
     * selection is cleared.
     *
     * @example
     * (selectionChange)="onSelChange($event)"
     *
     * onSelChange(sel: JxSelection | null) {
     *   if (sel) console.log(`A${sel.y1+1}:${sel.x2},${sel.y2}`);
     * }
     */
    selectionChange: EventEmitter<JxSelection>;
    host: ElementRef<HTMLDivElement>;
    editorInput?: ElementRef<HTMLInputElement>;
    defaultContextMenuTpl: TemplateRef<any>;
    css: readonly ["arrow-down", "arrow-up", "color", "copying", "copying-bottom", "copying-left", "copying-right", "copying-top", "custom-checkbox-width", "draggable", "dragging", "dragging-left", "dragging-right", "editor", "fullscreen", "highlight", "highlight-bottom", "highlight-left", "highlight-right", "highlight-selected", "highlight-top", "jclose", "jexcel", "jexcel_about", "jexcel_column_filter", "jexcel_comments", "jexcel_container", "jexcel_content", "jexcel_contextmenu", "jexcel_corner", "jexcel_dropdown", "jexcel_filter", "jexcel_freezed", "jexcel_hidden_index", "jexcel_nested", "jexcel_overflow", "jexcel_page", "jexcel_page_selected", "jexcel_pagination", "jexcel_pagination_dropdown", "jexcel_richtext", "jexcel_row", "jexcel_search", "jexcel_selectall", "jexcel_tab", "jexcel_tab_link", "jexcel_table", "jexcel_tabs", "jexcel_textarea", "jexcel_toolbar", "jexcel_toolbar_item", "material-icons", "readonly", "red", "resizable", "resizing", "selected", "selection", "selection-bottom", "selection-left", "selection-right", "selection-top", "styleBold", "with-toolbar"];
    data: any[][];
    footers: any[][];
    editing: {
        x: number;
        y: number;
        value: any;
    } | null;
    activeCell: {
        x: number;
        y: number;
    };
    loading: boolean;
    hiddenBySearch: Set<number>;
    filteredByColumn: Set<number>;
    /** Comment popup state. Null = closed. */
    activeComment: {
        x: number;
        y: number;
        text: string;
        top: number;
        left: number;
    } | null;
    /** Stato del pannello autocomplete. Null = pannello chiuso. */
    acState: {
        x: number;
        y: number;
        query: string;
        items: JxAutocompleteItem[];
        activeIndex: number;
        loading: boolean;
    } | null;
    private acSub;
    get searchMode(): 'hide' | 'dim';
    get searchDimOpacity(): number;
    /** Stores the tallest observed height of jexcel_content while pagination is active.
     * Updated just before each page navigation so the new page never renders shorter. */
    private _paginationStableHeight;
    private sub;
    private selecting;
    private selectionStart;
    private blurCommitTimer;
    private headerDrag;
    private headerResize;
    private rowResize;
    private rowDrag;
    private suppressHeaderClick;
    private suppressRowClick;
    private rowHeights;
    private copyRangeSelection;
    private copyRangeData;
    private fillHandleDrag;
    private fillDragPreviewX;
    private fillDragPreviewY;
    private fillDragDirection;
    constructor(workbook: JxWorkbookService<T>, address: JxAddressService, clipboard: JxClipboardService, cdr: ChangeDetectorRef, zone: NgZone);
    /** Merged list of built-in toolbar items + all plugin items. Used by the template. */
    get allToolbarItems(): import("../../models/jx-cell.models").JxToolbarItem[];
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private _initPlugins;
    private _destroyPlugins;
    /**
     * Initialises (or re-initialises) the workbook, wires all RxJS subscriptions,
     * and triggers the first data render.  Called automatically from `ngAfterViewInit`
     * and every subsequent `ngOnChanges` that replaces `options`.
     *
     * You can call this manually if you need a hard reset without changing the
     * `options` reference.
     */
    init(): void;
    /**
     * Returns the total number of visible columns (including any dynamically
     * added ones that exceed the length of `options.columns`).
     */
    get columnCount(): number;
    /**
     * Returns the evaluated column-header title strings (formulas resolved)
     * for all columns.  Delegates to `workbook.getEvaluatedHeaderTitles()`.
     */
    get headers(): string[];
    /**
     * Returns the column definition for column `x`, or `undefined` when
     * no column is configured at that index.
     *
     * @param x - Zero-based column index.
     */
    column(x: number): JxCellColumn<T> | undefined;
    /**
     * Returns the pixel width of column `x`, falling back to
     * `options.defaultColWidth` (default: `100` px).
     *
     * @param x - Zero-based column index.
     * @returns Width in pixels.
     */
    getColumnWidth(x: number): number;
    /**
     * Programmatically sets the width of column `x` in pixels (minimum: 40 px).
     * Also accessible via `workbook.setWidth()`.
     *
     * @param x     - Zero-based column index.
     * @param width - New width in pixels.
     */
    setColumnWidth(x: number, width: number): void;
    /**
     * Returns the pixel height of row `y`, falling back to
     * `options.defaultRowHeight` (default: `28` px).
     *
     * @param y - Zero-based row index.
     * @returns Height in pixels.
     */
    getRowHeight(y: number): number;
    /**
     * Programmatically sets the height of row `y` in pixels (minimum: 22 px).
     * Also accessible via `workbook.setHeight()`.
     *
     * @param y      - Zero-based row index.
     * @param height - New height in pixels.
     */
    setRowHeight(y: number, height: number): void;
    /**
     * Returns the column type string (lowercase) for column `x`,
     * e.g. `'text'`, `'numeric'`, `'dropdown'`, `'checkbox'`, `'calendar'`.
     *
     * @param x - Zero-based column index.
     * @returns Type string, defaulting to `'text'` when not configured.
     */
    columnType(x: number): string;
    /**
     * Returns the spreadsheet cell name (e.g. `'A1'`) for zero-based coordinates.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     * @returns Cell name string, e.g. `'B3'`.
     */
    cellName(x: number, y: number): string;
    /**
     * Returns the **raw** (unprocessed) value of cell `(x, y)`.
     * Formula strings are returned as-is (e.g. `'=A1+B1'`).
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     */
    rawValue(x: number, y: number): any;
    /**
     * Returns the processed (formula-evaluated) display value of cell `(x, y)`.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     */
    displayValue(x: number, y: number): any;
    /**
     * Returns `true` when the raw value of cell `(x, y)` is a formula string
     * (starts with `=`).
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based row index.
     */
    isFormula(x: number, y: number): boolean;
    /**
     * Returns all footer rows (processed) as a 2-D array, or an empty array
     * when no footers are configured.
     */
    get footerRows(): any[][];
    /**
     * Returns the display value of footer cell `(x, y)`.  Formulas are evaluated.
     *
     * @param x - Zero-based column index (physical, before colspan expansion).
     * @param y - Zero-based footer row index.
     */
    footerDisplayValue(x: number, y: number): any;
    /**
     * Returns the raw (unprocessed) value of footer cell `(x, y)`.
     *
     * @param x - Zero-based column index.
     * @param y - Zero-based footer row index.
     */
    footerRawValue(x: number, y: number): any;
    /**
     * Extracts the colspan from a `JxFooterCell` object, or returns `1` for
     * plain values.
     *
     * @param fx - Physical footer cell index (before colspan expansion).
     * @param fy - Zero-based footer row index.
     * @returns Colspan value (minimum `1`).
     */
    getFooterItemColspan(fx: number, fy: number): number;
    /**
     * Returns the display value from a footer cell, unwrapping `JxFooterCell`
     * objects (which carry a `value` property) or returning the raw value for
     * plain strings/numbers.
     *
     * @param fx - Physical footer cell index.
     * @param fy - Zero-based footer row index.
     */
    getFooterItemDisplayValue(fx: number, fy: number): any;
    /**
     * Calcola la colonna logica dell'elemento fx nella riga footer fy,
     * sommando i colspan degli elementi precedenti.
     */
    getFooterLogicalColumn(fy: number, fx: number): number;
    /** Conta le righe footer visibili che si trovano sotto `fy` (usato per sticky bottom). */
    private visibleFooterRowsBelow;
    /** Restituisce lo stile sticky per una cella footer appartenente a una colonna congelata. */
    getFooterCellStyle(fx: number, fy: number): Record<string, string> | null;
    getFooterRowHeaderStyle(fy?: number): Record<string, string>;
    isFooterCellFrozen(fx: number, fy: number): boolean;
    hasCustomFooterComponent(fx: number, fy: number): boolean;
    getCustomFooterComponent(fx: number, fy: number): any;
    createFooterCellContext(fx: number, fy: number): JxFooterCellContext<T>;
    customFooterInputs(fx: number, fy: number): Record<string, any>;
    get nestedHeaderRows(): Array<Array<{
        title: string;
        colspan: number;
    }>>;
    isCoveredCell(x: number, y: number): boolean;
    isMergeOrigin(x: number, y: number): boolean;
    getCellColspan(x: number, y: number): number | null;
    getCellRowspan(x: number, y: number): number | null;
    getCellDataMerged(x: number, y: number): string | null;
    getCellInlineStyle(x: number, y: number): Record<string, string> | null;
    get freezeRowsCount(): number;
    get freezeColumnsCount(): number;
    get contentStyle(): Record<string, string> | null;
    /**
     * Overflow inline sul container: deve essere `clip` (non `hidden`, non `auto`)
     * quando sticky è attivo ma freeze no. `overflow: hidden/auto` creerebbe un
     * "scroll container" che intercetta position:sticky prima di jexcel_content.
     * `overflow: clip` taglia visivamente il contenuto SENZA creare uno scroll container.
     * Con freeze attivo serve invece `hidden` per il corretto clipping dei pannelli congelati.
     */
    get containerStyle(): Record<string, string>;
    private get headerRowHeight();
    private get rowHeaderWidth();
    private get headerRowsCount();
    private get frozenHeaderHeight();
    isFrozenRow(y: number): boolean;
    isFrozenColumn(x: number): boolean;
    isHiddenColumn(x: number): boolean;
    isHiddenRow(y: number): boolean;
    getNestedHeaderSelectAllStyle(rowIndex: number): Record<string, string>;
    getNestedHeaderCellStyle(rowIndex: number, cellIndex: number): Record<string, string>;
    getMainHeaderSelectAllStyle(): Record<string, string>;
    getMainHeaderCellStyle(x: number): Record<string, string>;
    getRowHeaderCellStyle(y: number): Record<string, string>;
    /** Restituisce le classi CSS extra definite in `options.classes` per la colonna x. */
    getCellExtraClasses(x: number, y?: number): Record<string, boolean> | null;
    /** Returns the comment (annotation) for a cell, or null if none. Used for [title] tooltip. */
    getCellComment(x: number, y: number): string | null;
    /** Toggle the comment popup when the triangle indicator is clicked. */
    onCommentIndicatorClick(event: MouseEvent, x: number, y: number): void;
    closeComment(): void;
    getCellComputedStyle(x: number, y: number): Record<string, string> | null;
    private getFrozenRowTop;
    private getFrozenColumnLeft;
    isCellCopied(x: number, y: number): boolean;
    select(x: number, y: number, event?: MouseEvent): void;
    selectColumn(x: number, event?: MouseEvent): void;
    isSortableColumn(x: number): boolean;
    isFilterableColumn(x: number): boolean;
    getColumnFilterValue(x: number): string;
    onColumnFilterInput(x: number, value: string): void;
    clearAllColumnFilters(): void;
    getFilterRowCellStyle(): Record<string, string>;
    getSortDirection(x: number): 'asc' | 'desc' | null;
    canDragColumns(): boolean;
    canDragColumnHeader(x: number): boolean;
    canResizeColumns(): boolean;
    canResizeColumnHeader(_x: number): boolean;
    onHeaderMouseDown(x: number, event: MouseEvent): void;
    onHeaderMouseEnter(x: number, event: MouseEvent): void;
    onHeaderMouseMove(x: number, event: MouseEvent): void;
    isHeaderDragging(x: number): boolean;
    isHeaderResizing(x: number): boolean;
    isHeaderDropLeft(x: number): boolean;
    isHeaderDropRight(x: number): boolean;
    canResizeRows(): boolean;
    canDragRows(): boolean;
    canDragRowHeader(y: number): boolean;
    isRowResizing(y: number): boolean;
    isRowDragging(y: number): boolean;
    isRowDropTop(y: number): boolean;
    isRowDropBottom(y: number): boolean;
    onRowHeaderMouseDown(y: number, event: MouseEvent): void;
    onRowHeaderMouseEnter(y: number, event: MouseEvent): void;
    onRowHeaderMouseMove(y: number, event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentKeyDown(event: KeyboardEvent): void;
    selectRow(y: number, event?: MouseEvent): void;
    selectAll(): void;
    startMouseSelection(x: number, y: number, event: MouseEvent): void;
    updateMouseSelection(x: number, y: number): void;
    stopSelecting(): void;
    private updateHeaderDragTarget;
    private updateRowDragTarget;
    private computeColumnDestination;
    private getColumnDragDestination;
    private getColumnDropIndicator;
    private computeRowDestination;
    private getRowDragDestination;
    private getRowDropIndicator;
    isSelected(x: number, y: number): boolean;
    isFillHandleSourceCell(x: number, y: number): boolean;
    isFillPreviewCell(x: number, y: number): boolean;
    isFillPreviewTopCell(x: number, y: number): boolean;
    isFillPreviewBottomCell(x: number, y: number): boolean;
    isFillPreviewLeftCell(x: number, y: number): boolean;
    isFillPreviewRightCell(x: number, y: number): boolean;
    isFillDestinationHandleCell(x: number, y: number): boolean;
    private getFillPreviewBounds;
    fillHandleDragPreviewActive(): boolean;
    startEdit(x: number, y: number, initial?: string): void;
    commitEdit(): void;
    cancelEdit(): void;
    commitIfEditing(): void;
    onCellDoubleClick(event: MouseEvent, x: number, y: number): void;
    onCellClick(event: MouseEvent, x: number, y: number): void;
    onCellKey(event: KeyboardEvent, x: number, y: number): void;
    onEditorKey(event: KeyboardEvent): void;
    private handleNavigationKey;
    private handleUndoRedoShortcut;
    private handleCopyPasteShortcut;
    private performCopy;
    private performPaste;
    onFillHandleMouseDown(event: MouseEvent): void;
    onFillHandleMouseUp(event: MouseEvent): void;
    onInlineComponentMouseDown(event: MouseEvent, x: number, y: number): void;
    private getFillTargetRowFromMouseEvent;
    private getFillTargetColumnFromMouseEvent;
    private getMovementFromKey;
    private computeNextCell;
    private moveFrom;
    private isPrintableEditKey;
    private usesInlineComponentEditor;
    private isInlineActivationKey;
    private isEventInsideInlineComponent;
    private getInlineComponentHost;
    private getInlineFocusableControl;
    private activateInlineComponent;
    private focusInlineComponent;
    hasCustomAngularComponent(x: number): boolean;
    getCustomAngularComponent(x: number): any;
    customCellInputs(x: number, y: number): Record<string, any>;
    createCustomCellContext(x: number, y: number): JxCustomCellContext<T>;
    onInlineComponentKey(event: KeyboardEvent, x: number, y: number): void;
    onInlineComponentBlur(event: FocusEvent, x: number, y: number): void;
    private isColumnNumberLike;
    private focusAndSelectCell;
    private focusCellByCoords;
    onEditorBlur(event: FocusEvent): void;
    onEditorFocus(event: FocusEvent): void;
    onCellFocus(x: number, y: number, event: FocusEvent): void;
    private commitIfEditingDifferent;
    private focusCell;
    private focusEditor;
    isActiveCell(x: number, y: number): boolean;
    trackByRow(index: number): number;
    trackByColumn(index: number): number;
    updateInlineValue(x: number, y: number, value: any): void;
    changeCheckbox(x: number, y: number, checked: boolean): void;
    isEditable(x: number, y?: number): boolean;
    /** Used only for [class.readonly] CSS binding — does NOT include lock or API-readonly. */
    isColumnReadonly(x: number): boolean;
    setConfig(patch: Partial<JxCellOptions<T>>): void;
    insertRow(rowData?: any[] | Record<string, any>): void;
    insertColumn(defaultValue?: string): void;
    moveColumn(from: number, to: number): void;
    moveRow(from: number, to: number): void;
    undo(): boolean;
    redo(): boolean;
    setValue(cell: string, value: any): void;
    getValue(cell: string): any;
    getRawValue(cell: string): any;
    getData(): any[][];
    getRawData(): any[][];
    getJson(processed?: boolean | any): any[];
    getObject(rowNumber?: number, processed?: boolean): any;
    getRowData(rowNumber: number, processed?: boolean): any[];
    getColumnData(columnNumber: number, processed?: boolean): any[];
    getHeaders(): string[];
    getConfig(): JxCellOptions<T>;
    getFooters(processed?: boolean): any[][];
    getFooter(row: number, column: number, processed?: boolean): any;
    setFooter(row: number, column: number, value: any): void;
    setFooters(footers: any[][]): void;
    setMerge(cellName: string, colspan?: number, rowspan?: number): void;
    getMerge(cellName?: string): any;
    removeMerge(cellName: string): void;
    destroyMerged(): void;
    copy(cut?: boolean): void;
    paste(): void;
    fillDown(fromX: number, fromY: number, toY: number): void;
    setCellReadonly(cellName: string, value?: boolean): void;
    setRowReadonly(row: number, value?: boolean): void;
    setColumnReadonly(col: number, value?: boolean): void;
    clearAllReadonly(): void;
    setLocked(value: boolean): void;
    isLocked(): boolean;
    getColumnOptions(col: number): JxCellColumn<Record<string, any>>;
    getJsonRow(rowNumber: number): Record<string, any>;
    isColMerged(col: number): boolean;
    orderBy(col: number, asc?: boolean | 'asc' | 'desc' | null): void;
    refreshSelection(): void;
    setReadOnly(value: boolean): void;
    setCheckRadioValue(x: number, y: number, value: boolean | string): void;
    updateMeta(cellName: string, meta: Record<string, any>): void;
    parseNumber(value: any): number;
    parseValue(value: any, col?: number): any;
    getFreezeWidth(): number;
    hash(): number;
    injectArray(x: number, y: number, data: any[][]): void;
    setStyle(cellName: string, style: Record<string, string>): void;
    getColumnNameFromId(index: number): string;
    getCellFromCoords(x: number, y: number): any;
    openFilter(col?: number): void;
    resetFilters(): void;
    save(): void;
    destroy(): void;
    updateSelectionFromCoords(x1: number, y1: number, x2?: number, y2?: number): void;
    whichPage(): number;
    page(num?: number): void;
    loadPage(n: number): void;
    loadUp(): void;
    loadDown(): void;
    updatePagination(): void;
    getPageCount(): number;
    getPageSize(): number;
    conditionalSelectionUpdate(): void;
    /** Returns array of page indices to show in the pagination bar (max 9 buttons, windowed). */
    getPaginationPages(): number[];
    /** Returns the "Showing page X of Y" label for the pagination bar. */
    paginationLabel(): string;
    /** Cast item.v to string[] for the select toolbar item. */
    asStringArray(v: string | string[] | undefined): string[];
    onToolbarItemClick(event: MouseEvent, item: import('../../models/jx-cell.models').JxToolbarItem): void;
    onToolbarSelectChange(event: Event, item: import('../../models/jx-cell.models').JxToolbarItem): void;
    onToolbarColorChange(event: Event, item: import('../../models/jx-cell.models').JxToolbarItem): void;
    private _applyToolbarStyle;
    closeFilter(): void;
    setDictionary(dict: Partial<import('../../models/jx-cell.models').JxCellText>): void;
    setExtensions(extensions: Record<string, any>): void;
    setHistory(data?: any[][]): void;
    executeFormula(expression: string): any;
    doubleDigitFormat(n: number): string;
    validLetter(c: string): boolean;
    /** Returns the DOM element of a cell by coordinates (queries the rendered table). */
    getCell(x: number, y: number): HTMLElement | null;
    /** Returns the main table DOM element. */
    getElement(): HTMLTableElement | null;
    isReadOnly(cellName: string): boolean;
    getComments(cellName?: string): string | Record<string, string>;
    setComments(cellName: string, comment: string | null): void;
    clearComments(cellName?: string): void;
    addClass(cellName: string, className: string): void;
    removeClass(cellName: string, className?: string): void;
    getClasses(cellName: string): string[];
    resetStyle(cellName?: string): void;
    /** Toggle fullscreen mode on the host element. */
    fullscreen(): void;
    setData(data: any[][] | Record<string, any>[]): void;
    appendData(data: any[][] | Record<string, any>[]): void;
    search(query: string): void;
    resetSearch(): void;
    getSearchQuery(): string;
    saveState(): void;
    clearPersistence(): void;
    getPersistedData(): any[][] | null;
    dispatch(eventName: string, detail?: any): void;
    /** Typed event bus: subscribe per reagire/intercettare eventi senza callbacks nelle options. */
    get events(): {
        readonly beforeChange$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxChangePayload>>;
        readonly beforeInsertRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxRowOpPayload>>;
        readonly beforeDeleteRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxRowOpPayload>>;
        readonly beforeInsertColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxColOpPayload>>;
        readonly beforeDeleteColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxColOpPayload>>;
        readonly beforeMoveColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxMoveColPayload>>;
        readonly beforeMoveRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxMoveRowPayload>>;
        readonly beforePaste$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxPastePayload>>;
        readonly beforeMerge$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxMergePayload>>;
        readonly beforeResizeColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxResizeColPayload>>;
        readonly beforeResizeRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxResizeRowPayload>>;
        readonly beforeEditionEnd$: import("rxjs").Subject<import("../../models/jx-cell.models").JxCancellableEvent<import("../../models/jx-cell.models").JxBeforeEditionEndPayload>>;
        readonly change$: import("rxjs").Subject<import("../../models/jx-cell.models").JxChangePayload>;
        readonly afterChanges$: import("rxjs").Subject<import("../../models/jx-cell.models").JxAfterChangesPayload>;
        readonly insertRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxRowOpPayload>;
        readonly deleteRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxRowOpPayload>;
        readonly insertColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxColOpPayload>;
        readonly deleteColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxColOpPayload>;
        readonly moveColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxMoveColPayload>;
        readonly moveRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxMoveRowPayload>;
        readonly paste$: import("rxjs").Subject<import("../../models/jx-cell.models").JxPastePayload>;
        readonly merge$: import("rxjs").Subject<import("../../models/jx-cell.models").JxMergePayload>;
        readonly resizeColumn$: import("rxjs").Subject<import("../../models/jx-cell.models").JxResizeColPayload>;
        readonly resizeRow$: import("rxjs").Subject<import("../../models/jx-cell.models").JxResizeRowPayload>;
        readonly selection$: import("rxjs").Subject<JxSelection>;
        readonly editionStart$: import("rxjs").Subject<import("../../models/jx-cell.models").JxEditionStartPayload>;
        readonly editionEnd$: import("rxjs").Subject<import("../../models/jx-cell.models").JxEditionEndPayload>;
        readonly sort$: import("rxjs").Subject<import("../../models/jx-cell.models").JxSortPayload>;
        readonly footerChange$: import("rxjs").Subject<import("../../models/jx-cell.models").JxFooterChangePayload>;
        readonly persist$: import("rxjs").Subject<import("../../models/jx-cell.models").JxPersistPayload>;
        readonly undo$: import("rxjs").Subject<void>;
        readonly redo$: import("rxjs").Subject<void>;
        readonly click$: import("rxjs").Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        readonly focus$: import("rxjs").Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        readonly load$: import("rxjs").Subject<void>;
        readonly blur$: import("rxjs").Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        readonly changeHeader$: import("rxjs").Subject<{
            col: number;
            oldTitle: string;
            newTitle: string;
        }>;
        readonly cancelCell$: import("rxjs").Subject<{
            x: number;
            y: number;
            cellName: string;
        }>;
        readonly destroy$: import("rxjs").Subject<void>;
        readonly changeMeta$: import("rxjs").Subject<{
            cell: string;
            meta: Record<string, any>;
        }>;
        readonly changeStyle$: import("rxjs").Subject<{
            cells: string[];
        }>;
        readonly copy$: import("rxjs").Subject<{
            data: any[][];
            cut: boolean;
        }>;
        readonly selectStart$: import("rxjs").Subject<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        }>;
    };
    getText(key: keyof import('../../models/jx-cell.models').JxCellText): string;
    getColumnName(index: number): string;
    getIdFromColumnName(name: string): number;
    getDropDownValue(col: number, key: any): string;
    /**
     * Restituisce l'indice della colonna (0-based) dato il nome della chiave JSON
     * (`name` o `field`) nella definizione delle colonne.
     * Ritorna -1 se nessuna colonna corrisponde.
     */
    getColumnByKey(key: string): number;
    /**
     * Restituisce la chiave JSON (`name` o `field`) della colonna all'indice dato.
     * Usata internamente per popolare `data-col-key` su header e celle.
     */
    getColKey(x: number): string;
    /** Returns `true` if the nested-header cell at row `nh`, cell index `ni` has a custom component. */
    hasCustomNestedHeaderComponent(nh: number, ni: number): boolean;
    /** Returns the custom Angular component type for nested-header cell `[nh][ni]`, or `null`. */
    getCustomNestedHeaderComponent(nh: number, ni: number): any;
    /**
     * Computes the logical column index (= first data column covered) for nested-header
     * cell `ni` in row `nh`, by summing all preceding `colspan` values.
     */
    getNestedHeaderLogicalCol(nh: number, ni: number): number;
    /**
     * Builds the `JxNestedHeaderCellContext` object that is injected into a custom
     * nested-header component via `@Input() context`.
     *
     * @param nh - 0-based index of the nestedHeaders row.
     * @param ni - 0-based index of the cell within that row.
     */
    createNestedHeaderCellContext(nh: number, ni: number): JxNestedHeaderCellContext<T>;
    /**
     * Returns the `inputs` map passed to `ngComponentOutlet` for a custom nested-header cell.
     * Wraps `createNestedHeaderCellContext` so the template stays clean.
     */
    customNestedHeaderInputs(nh: number, ni: number): Record<string, any>;
    hasCustomHeaderComponent(x: number): boolean;
    getCustomHeaderComponent(x: number): any;
    createHeaderCellContext(x: number): JxHeaderCellContext<T>;
    customHeaderInputs(x: number): Record<string, any>;
    /**
     * Risolve la label da mostrare in display mode per una cella autocomplete.
     * Se la source è statica (array), cerca il match sull'id.
     * Se la source è async (callback/Promise/Observable), non può risolvere
     * sincronamente: restituisce il valore grezzo come stringa.
     */
    getAcLabel(x: number, y: number): string;
    /**
     * Restituisce la lista di opzioni per la colonna x, riga y,
     * applicando il `filterFn` se definito.
     * Usato nel template per `dropdown`.
     */
    getFilteredSource(x: number, y: number, query?: string): any[];
    /** Normalizza un item grezzo (stringa o {id,name}) in JxAutocompleteItem. */
    private normalizeAcItem;
    /** Apre/aggiorna il pannello suggerimenti per la cella (x,y) con la query data. */
    acFetch(x: number, y: number, query: string): void;
    /** Chiude il pannello suggerimenti senza salvare. */
    acClose(): void;
    /** Stile di posizionamento del dropdown autocomplete rispetto alla cella attiva. */
    get acDropdownStyle(): Record<string, string>;
    /** Seleziona l'item all'indice `i` (o `acState.activeIndex`) e chiude il pannello. */
    acSelect(i?: number): void;
    /** Naviga su/giù nel pannello suggerimenti da tastiera. */
    acNavigate(dir: 1 | -1): void;
    /** Handler keydown sull'editor autocomplete. */
    onAcEditorKey(event: KeyboardEvent, x: number, y: number): void;
    /** Commit diretto senza passare per editing state. */
    private commitEditWith;
    /** Restituisce il template da usare per il context menu (custom o built-in). */
    getContextMenuTemplate(): TemplateRef<any> | null;
    /**
     * Restituisce `true` se il context menu è disabilitato per la cella (x, y).
     * Il menu viene disabilitato se:
     * - `options.contextMenu` non è configurato
     * - `options.contextMenu.disabled` è `true`
     * - `options.contextMenu.disabled` è una callback che restituisce `true` per (x, y)
     */
    isContextMenuDisabled(x: number, y: number): boolean;
    /** Costruisce il dato passato come contesto al template del context menu. */
    buildContextMenuData(x: number, y: number): JxContextMenuContext;
    /** Alias pubblici per Copia/Incolla usati nel template del context menu built-in. */
    copyCells(): void;
    pasteCells(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxSpreadsheetComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JxSpreadsheetComponent<any>, "jx-spreadsheet", never, { "options": { "alias": "options"; "required": false; }; }, { "ready": "ready"; "selectionChange": "selectionChange"; }, never, never, false, never>;
}
