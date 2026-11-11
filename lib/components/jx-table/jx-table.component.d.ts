import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, SimpleChanges, TemplateRef } from '@angular/core';
import { JxAutocompleteItem, JxCellColumn, JxCellOptions, JxContextMenuContext, JxFooterCellContext, JxHeaderCellContext, JxNestedHeaderCellContext, JxSelection, JxCustomCellContext, JxRowHeaderCellRef } from '../../models/jx-cell.models';
import { SafeHtml } from '@angular/platform-browser';
import { JxAddressService } from '../../services/jx-address.service';
import { JxClipboardService } from '../../services/jx-clipboard.service';
import { JxIconService } from '../../services/jx-icon.service';
import { JxWorkbookService } from '../../services/jx-workbook.service';
import { JxTableIconKey } from '../../tokens/jx-cell-icons.tokens';
import * as i0 from "@angular/core";
/** Per-cell selection state computed once per cell and shared with the template via `@let`. */
export interface JxCellSelectionState {
    /** True when the cell falls inside the current selection range. */
    selected: boolean;
    /** True when the cell is on the top edge of the selection range. */
    top: boolean;
    /** True when the cell is on the bottom edge of the selection range. */
    bottom: boolean;
    /** True when the cell is on the left edge of the selection range. */
    left: boolean;
    /** True when the cell is on the right edge of the selection range. */
    right: boolean;
}
/**
 * Module-level registry that tracks the currently active `jx-table` workbook.
 *
 * When any table calls `activate(wb)`:
 *  - every other registered workbook receives `tableDeactivate$.next()` and
 *    has its selection reset (so the blue highlight disappears from inactive tables).
 *  - the new workbook becomes the sole active entry.
 *
 * Custom cell components that extend `JxCustomCellBase` and implement
 * `jxOnTableDeactivate()` will be notified automatically via `wireLifecycle()`.
 */
export declare class JxTableRegistry {
    private static readonly _all;
    private static _active;
    /** Called by `JxTableComponent` when the table receives a user click. */
    static activate(workbook: any): void;
    /** Registers a workbook in the global set (idempotent). */
    static register(workbook: any): void;
    /** Removes a workbook when its table is destroyed. */
    static deregister(workbook: any): void;
}
/**
 * Main table component. Drop this into any template to render a fully
 * featured interactive data grid backed by `JxWorkbookService`.
 *
 * ```html
 * <jx-table [options]="gridOptions" (ready)="onReady($event)"></jx-table>
 * ```
 *
 * The component creates a **private** `JxWorkbookService` instance per grid
 * via its `providers` array.  Use the `ready` output to get the workbook
 * reference and interact with the grid programmatically.
 *
 * @template T  Shape of each row object (used for typed `getJson()`/`getObject()` results).
 */
export declare class JxTableComponent<T extends Record<string, any> = Record<string, any>> implements AfterViewInit, OnChanges, OnDestroy {
    workbook: JxWorkbookService<T>;
    address: JxAddressService;
    private clipboard;
    private cdr;
    private zone;
    private icons;
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
    selectionChange: EventEmitter<JxSelection | null>;
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
    /**
     * Windowed list of rows actually rendered in the `<tbody>`.
     * When `virtualScroll` is off this contains every row (absolute `y` === array
     * index); when on it contains only the rows intersecting the viewport plus
     * overscan. Each entry carries the ABSOLUTE row index `y` so that selection,
     * merges and `data-y` stay coherent.
     */
    visibleRows: Array<{
        y: number;
        row: any[];
    }>;
    /** Pixel height of the spacer `<tr>` rendered above the visible window. */
    topSpacerPx: number;
    /** Pixel height of the spacer `<tr>` rendered below the visible window. */
    bottomSpacerPx: number;
    /** Comment popup state. Null = closed. */
    activeComment: {
        x: number;
        y: number;
        text: string;
        top: number;
        left: number;
    } | null;
    /** Auto-close timer handle for the comment popup (set via setCommentsTemporized). */
    private commentAutoCloseTimer;
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
    private acScrollSub;
    private commentScrollSub;
    /** Prevents acClose() firing when focus shifts from the hidden anchor to the overlay filter input. */
    private acFocusingFilter;
    /** Cache col-index → Map<id, label>. Populated by acFetch so async sources can resolve display labels. */
    private _acLabelCache;
    /** Columns for which a background prefetch has already been fired (to avoid repeated requests). */
    private _acLabelPrefetched;
    get searchMode(): 'hide' | 'dim';
    get searchDimOpacity(): number;
    /** Stores the tallest observed height of jexcel_content while pagination is active.
     * Updated just before each page navigation so the new page never renders shorter. */
    private _paginationStableHeight;
    private sub;
    private selecting;
    private selectionStart;
    /** Anchor cell retained across Shift+clicks; unlike the selection, it is not replaced by the target cell. */
    private selectionAnchor;
    /** Prevents the click event following mousedown from emitting the same selection twice. */
    private mouseSelectionHandled;
    /** Set on a right-click mousedown so the ensuing focus event does not collapse the selection. */
    private _suppressFocusSelect;
    /**
     * Per-cell render caches for `getCellComputedStyle` / `getCellExtraClasses`.
     * They survive change-detection passes triggered by selection/hover (which do
     * NOT affect cell style or classes), eliminating most per-cell work during a
     * selection drag. Cleared via `bumpCellRenderCache()` whenever something that
     * actually changes a cell's style/classes happens (data, styles, classes,
     * config, visibility, sort, resize).
     */
    private _cellStyleCache;
    private _cellClassCache;
    /** Shared inert context-menu data returned for every cell when no context menu is configured. */
    private _inertContextMenuData?;
    private blurCommitTimer;
    private headerDrag;
    private headerResize;
    /** Columns where word-wrap has been suppressed by auto-fit double-click. Restored on manual drag-resize. */
    private noWrapCols;
    /** Tracks the last mousedown on a resize border for double-click auto-fit detection. */
    private lastResizeBorderDown;
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
    /**
     * Cached actual rendered column widths (px) read from the DOM header row.
     * Used by getFrozenColumnLeft so that left offsets match real widths even when
     * table-layout:fixed + min-width:100% stretches columns beyond their configured values.
     * Populated after each init/resize; falls back to getColumnWidth() when empty.
     */
    private _renderedColWidths;
    private _renderedRowHeaderWidth;
    /** Prevents multiple rAF rebuild calls in the same frame. */
    private _colWidthRebuildPending;
    /** ResizeObserver that rebuilds the frozen-column left cache when the host is resized. */
    private _colWidthObserver;
    /**
     * Last host width (px, rounded) seen by {@link _colWidthObserver}. Used to
     * ignore height-only resizes (e.g. a vertical scrollbar toggling) so that a
     * sub-pixel layout change at fractional browser zoom cannot start a
     * ResizeObserver → rebuild → layout → ResizeObserver oscillation that makes
     * the grid scroll up/down on its own (bug: TS con tante righe a zoom 75%).
     */
    private _lastObservedHostWidth;
    /**
     * Cumulative pixel offsets of each row (length `data.length + 1`), used by the
     * row virtualization to map scrollTop ↔ row index via binary search. Index `y`
     * holds the Y offset of the top of row `y`; the last entry is the total height.
     * Visually-hidden rows (pagination/search-hide) contribute 0 so offsets stay
     * aligned with the real DOM layout.
     */
    private _rowOffsets;
    /** Current virtual window [start, end) of rendered absolute row indices. */
    private _virtualWindow;
    /** Guards against scheduling more than one window recompute per animation frame. */
    private _scrollRafPending;
    /**
     * Real rendered default row height read from the DOM.
     *
     * This intentionally lives beside the virtual scroll state because browser zoom,
     * borders and table layout can make the rendered row box slightly different from
     * the configured defaultRowHeight. Using the measured value keeps rowOffsets,
     * top/bottom spacers and scrollTop mapping aligned at 75%/80%/90% zoom.
     */
    private _measuredDefaultRowHeight;
    /** Last known vertical scroll direction, captured before _lastScrollTop changes. */
    private _scrollingDown;
    /**
     * True when the data contains at least one vertical merge (`rowspan > 1`).
     * Row virtualization cannot keep a merge whose origin is scrolled out of the
     * window visually correct, so virtualization self-disables in that case.
     * Refreshed by {@link rebuildVisibleRows}.
     */
    private _hasVerticalMerge;
    /** Ensures the "virtualScroll disabled by merges" warning is logged once. */
    private _virtualMergeWarned;
    /** Last recorded scrollTop, used to compute scroll velocity. */
    private _lastScrollTop;
    /** Timestamp of the last scroll event (performance.now), for velocity calc. */
    private _lastScrollTime;
    /**
     * Extra overscan rows added dynamically based on scroll velocity.
     * Proportional to speed so fast scrolls pre-render more rows ahead,
     * eliminating the white-flash. Decays back to 0 when scroll stops.
     */
    private _velocityOverscan;
    /** Timer that resets {@link _velocityOverscan} after scroll inactivity. */
    private _velocityDecayTimer;
    constructor(workbook: JxWorkbookService<T>, address: JxAddressService, clipboard: JxClipboardService, cdr: ChangeDetectorRef, zone: NgZone, icons: JxIconService);
    /**
     * Resolves an icon for this component as `SafeHtml` for `[innerHTML]` binding.
     * Looks up the `'jx-table'` icon set, applying any override provided via the
     * `JX_ICONS` token and falling back to the built-in default.
     *
     * @param key - The icon key (e.g. `'sortAsc'`, `'pageNext'`).
     */
    icon(key: JxTableIconKey): SafeHtml;
    /**
     * Resolves an icon for this component as a plain string, for use in text-only
     * contexts such as attribute bindings (e.g. an input `placeholder`). Applies
     * the same override → default fallback as {@link icon}. HTML/SVG markup is not
     * rendered here — only the raw string value is returned.
     *
     * @param key - The icon key (e.g. `'filterPlaceholder'`).
     */
    iconRaw(key: JxTableIconKey): string;
    /**
     * Returns the rendering mode for the `filterPlaceholder` icon:
     * - `'html'`  → value starts with `<`  (inline HTML / SVG markup, rendered via innerHTML)
     * - `'url'`   → value starts with `url:` (path to an image file, rendered via <img src>)
     * - `'text'`  → plain text / Unicode glyph (rendered as input placeholder attribute)
     */
    filterIconMode(): 'text' | 'html' | 'url';
    /** Extracts the URL when filterIconMode() === 'url'. Strips the `url:` prefix. */
    filterIconUrl(): string;
    /**
     * Returns the rendering mode for the column-header `filterIndicator` icon:
     * - `'none'` → value is empty / whitespace (no indicator is rendered)
     * - `'url'`  → value starts with `url:` (path to an image, rendered via <img src>)
     * - `'html'` → any other value: glyph, HTML or inline SVG (rendered via innerHTML)
     */
    filterIndicatorMode(): 'none' | 'html' | 'url';
    /** Extracts the URL when filterIndicatorMode() === 'url'. Strips the `url:` prefix. */
    filterIndicatorUrl(): string;
    /** Merged list of built-in toolbar items + all plugin items. Used by the template. */
    get allToolbarItems(): import("jx-cell").JxToolbarItem[];
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
     * True when row virtualization is active. Requires `options.virtualScroll`
     * to be `true` AND the absence of vertical merges (`rowspan > 1`), which are
     * not compatible with windowing (their origin row may be scrolled out).
     */
    get virtualEnabled(): boolean;
    /** Refreshes {@link _hasVerticalMerge} from the workbook merge map. */
    private refreshVerticalMergeFlag;
    /** Colspan of the virtual spacer rows so they span the full table width. */
    get virtualSpacerColspan(): number;
    /** Scroll container element (`.jexcel_content`) or null before view init. */
    private getContentEl;
    /** A row that is collapsed to 0px in layout (pagination / search-hide). */
    private isRowVisuallyCollapsed;
    /** Row height used by virtualization when no explicit row override exists. */
    private get virtualDefaultRowHeight();
    /**
     * Measures a currently-rendered body row and calibrates the virtual default
     * height. This fixes fractional zoom jitter where configured rowHeight and the
     * actual table row box diverge by sub-pixels/borders.
     */
    private measureRenderedDefaultRowHeight;
    /** Rebuilds the cumulative row-offset index used by the virtual window. */
    private buildRowOffsets;
    /** Largest row index whose top offset is `<= px` (binary search). */
    private findRowAtOffset;
    /**
     * Recomputes `visibleRows` + spacer heights. When virtualization is off this
     * renders every row with zero spacers; when on it renders only the rows
     * intersecting the viewport (plus overscan) and sizes the spacers so the
     * scrollbar and total height stay identical to a fully-rendered grid.
     */
    rebuildVisibleRows(): void;
    /**
     * Scroll handler bound on `.jexcel_content`. Throttled to one recompute per
     * animation frame; only triggers change detection when the window changed.
     */
    /**
     * Updates {@link _velocityOverscan} from the current scroll event.
     * Velocity (px/ms) → extra rows. Capped at `maxVelocityOverscan` (default 40).
     * A decay timer resets it to 0 after 150 ms of scroll inactivity.
     */
    private updateVelocityOverscan;
    onContentScroll(): void;
    /**
     * Invokes `options.updateTable` for every cell currently present in the DOM.
     * Without virtualization this is the whole grid; with virtualization it is the
     * visible window, and the callback is re-run whenever the window changes.
     */
    private runUpdateTableCallback;
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
     * Schedules a single `requestAnimationFrame` call to rebuild `_renderedColWidths`.
     * The pending flag ensures at most one rebuild per frame even if called many times
     * (e.g. during a column drag-resize mousemove loop).
     */
    private scheduleColWidthsRebuild;
    /**
     * Reads actual rendered column widths from the DOM and updates `_renderedColWidths[]`.
     *
     * `getColumnWidth(x)` returns `_renderedColWidths[x]` when it exceeds the configured
     * value, preventing `<col>` from snapping back to a smaller configured value when
     * Angular CD is triggered (e.g. by a combo/autocomplete opening).
     *
     * `getFrozenColumnLeft(x)` also uses this cache for accurate sticky left-offsets.
     *
     * Guards:
     *  - Skipped when `acState !== null` — combo open may temporarily affect scrollbar
     *    width, producing transient (narrower) DOM widths.
     *  - `markForCheck()` only called for frozen tables — plain tables rely on the
     *    `getColumnWidth` cache and need no extra CD cycle.
     *
     * Does NOT modify `options.columns`.
     */
    private buildRenderedColWidthsFromDom;
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
     * Returns the table cell name (e.g. `'A1'`) for zero-based coordinates.
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
    /** Normalizza la maschera della colonna `x` come JxMaskConfig, o `null`. */
    getColMaskConfig(x: number): import('../../models/jx-cell.models').JxMaskConfig | null;
    /** Formatta `value` applicando il pattern della maschera della colonna `x`. */
    private _applyMaskFormat;
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
     * Number of contiguous VISIBLE footer rows starting at `fy` (inclusive). When
     * a collapsible group below `fy` is collapsed its rows are hidden, so this
     * shrinks back to `1`. Used to size a footer cell's `rowspan`.
     */
    private visibleFooterRowSpanFrom;
    /**
     * Extracts the rowspan for a footer cell. Two modes:
     * - `groupRowspan: true` (or `rowspan: 'group'`): auto — spans every VISIBLE
     *   footer row from `fy` to the end of its collapsible group (collapses to `1`
     *   when the group is collapsed).
     * - `rowspan: <number>`: explicit, clamped to the available visible rows.
     * Plain cells / no rowspan → `1`.
     *
     * @param fx - Physical footer cell index.
     * @param fy - Zero-based footer row index.
     */
    getFooterItemRowspan(fx: number, fy: number): number;
    /**
     * True when footer cell `(fx, fy)` falls inside the colspan×rowspan rectangle
     * of a cell in an earlier footer row (i.e. it is covered by that cell's
     * `rowspan`) and must therefore not be rendered — mirrors how merged body
     * cells are skipped.
     */
    isFooterCellCovered(fx: number, fy: number): boolean;
    /**
     * A footer cell is hidden when ALL logical columns it covers are hidden.
     * Uses `getFooterLogicalColumn` + `getFooterItemColspan` so colspan cells
     * are handled correctly regardless of the physical index `fx`.
     */
    isFooterCellHidden(fx: number, fy: number): boolean;
    /** Returns the classList from a JxFooterCell object, normalised to a string[] (or empty array). */
    getFooterItemClassList(fx: number, fy: number): string[];
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
    /**
     * Computes the starting logical column index for nested header cell `ni` in row `nh`.
     * This is simply the sum of all previous cells' colspans.
     */
    nestedHeaderCellStart(nh: number, ni: number): number;
    /**
     * Returns the effective colspan for nested header cell `ni` in row `nh`,
     * counting only non-hidden columns within its range.
     */
    getNestedHeaderEffectiveColspan(nh: number, ni: number): number;
    /**
     * A nested header cell is hidden when ALL columns it covers are hidden
     * (i.e. its effective colspan is 0).
     */
    isNestedHeaderCellHidden(nh: number, ni: number): boolean;
    /** Returns the nested header cell (of row `nh`) that covers logical column `x`, or `null`. */
    private nestedCellCoveringColumn;
    /**
     * True when column `x` does NOT belong to any nested header group: for every
     * nested header row the covering cell has `colspan === 1` and an empty title.
     * Such columns render their main header cell with a `rowspan` that fills the
     * whole header height (see {@link headerRowSpan}), so no empty nested cell
     * scrolls independently above them.
     */
    isStandaloneHeaderColumn(x: number): boolean;
    /**
     * True when nested header cell `(nh, ni)` belongs to a standalone column.
     * In the first nested row such a slot is replaced by the (rowspanned) main
     * header cell; in the remaining nested rows it is skipped entirely.
     */
    isNestedCellStandalone(nh: number, ni: number): boolean;
    /** Number of stacked header rows (nested rows + the main header row). */
    get headerRowSpan(): number;
    isCoveredCell(x: number, y: number): boolean;
    isMergeOrigin(x: number, y: number): boolean;
    getCellColspan(x: number, y: number): number | null;
    getCellRowspan(x: number, y: number): number | null;
    getCellDataMerged(x: number, y: number): string | null;
    getCellInlineStyle(x: number, y: number): Record<string, string> | null;
    get freezeRowsCount(): number;
    get freezeColumnsCount(): number;
    get freezeColumnsRightCount(): number;
    /** True when any freeze (rows, left columns or right columns) is active. */
    get freezeActive(): boolean;
    get contentStyle(): Record<string, string> | null;
    /**
     * Overflow inline sul container: deve essere `clip` (non `hidden`, non `auto`)
     * quando sticky è attivo ma freeze no. `overflow: hidden/auto` creerebbe un
     * "scroll container" che intercetta position:sticky prima di jexcel_content.
     * `overflow: clip` taglia visivamente il contenuto SENZA creare uno scroll container.
     * Con freeze attivo serve invece `hidden` per il corretto clipping dei pannelli congelati.
     */
    get containerStyle(): Record<string, string>;
    /** True when at least one explicit dimension is set on the grid. */
    get hasDimensions(): boolean;
    /** True when the host should stretch to fill the remaining space of a flex/grid parent. */
    private get isFillHeight();
    get hostWidth(): string;
    /**
     * Altezza esplicita dell'host.
     * Priorità: tableHeight > visibleRowCount (header 34 + n × defaultRowHeight).
     * 'fill' non genera altezza esplicita: usa flex:1.
     */
    get hostHeight(): string;
    /** Applied only when tableHeight='fill': makes the host stretch inside a flex/grid parent. */
    get hostFlex(): string;
    /** Prevents the host from collapsing inside a flex parent when flex:1 is set. */
    get hostMinHeight(): string;
    get hostDisplay(): string;
    get hostFlexDirection(): string;
    get hostOverflow(): string;
    private get headerRowHeight();
    get rowHeaderWidth(): number;
    /**
     * Applica larghezza (`rowHeaderWidth`) e stile (`rowHeaderStyle`) configurabili
     * a una cella della colonna degli header di riga, preservando le proprietà di
     * layout sticky già impostate dal chiamante.
     */
    private decorateRowHeaderStyle;
    /**
     * Total pixel width of the table = row-header + sum of all visible column widths.
     * Bound to [style.width.px] on <table> so that table-layout:fixed uses exactly
     * the configured column widths — the browser cannot stretch them.
     */
    get tablePixelWidth(): number;
    private get headerRowsCount();
    private get frozenHeaderHeight();
    isFrozenRow(y: number): boolean;
    isFrozenColumn(x: number): boolean;
    /**
     * True when column `x` is frozen on the RIGHT edge (always visible during
     * horizontal scroll). A column that is already frozen on the left never
     * counts as right-frozen (left takes precedence).
     */
    isFrozenColumnRight(x: number): boolean;
    /**
     * True when column `x` is the LEFT-most column of the right-frozen block —
     * used to draw the divider border between the scrolling body and the frozen
     * right pane.
     */
    isFrozenColumnRightFirst(x: number): boolean;
    /** True when every non-hidden column in `[start, last]` is frozen on the left. */
    private rangeAllFrozenLeft;
    /** True when every non-hidden column in `[start, last]` is frozen on the right. */
    private rangeAllFrozenRight;
    /** True when nested header cell `(nh, ni)` covers only frozen (left or right) columns. */
    isNestedHeaderCellFrozen(nh: number, ni: number): boolean;
    isHiddenColumn(x: number): boolean;
    isHiddenRow(y: number): boolean;
    getNestedHeaderSelectAllStyle(rowIndex: number): Record<string, string>;
    getNestedHeaderCellStyle(rowIndex: number, cellIndex: number): Record<string, string>;
    getMainHeaderSelectAllStyle(): Record<string, string>;
    getMainHeaderCellStyle(x: number, spannedToTop?: boolean): Record<string, string>;
    getRowHeaderCellStyle(y: number): Record<string, string>;
    /**
     * Returns the rendered `<td>` element for a body row-header (row-number)
     * cell, or `null` if it is not currently in the DOM. Used by
     * {@link JxWorkbookService.getRowHeaderCell}.
     */
    getRowHeaderCellElement(row: number): HTMLElement | null;
    /**
     * Content rendered inside a body row-header cell.
     * Priority: `options.rowHeaderContent` (string or `(rowIndex, row) => string`)
     * overrides the 1-based number; otherwise the number is shown unless
     * `options.rowHeaderNumbers === false`. The returned string is bound via
     * `[innerHTML]` so simple (sanitised) icon markup is supported.
     */
    getRowHeaderContent(y: number): string;
    /**
     * Live handle to a row-header (row-number) cell — shortcut for
     * `workbook.getRowHeaderCell(row)`.
     */
    getRowHeaderCell(row: number): JxRowHeaderCellRef;
    /** Restituisce le classi CSS extra definite in `options.classes` per la colonna x. */
    getCellExtraClasses(x: number, y?: number): Record<string, boolean> | null;
    /** Returns the CSS classes for the header `<td>` of column `x` (from `column.headerClassList`). */
    getHeaderClassList(x: number): string[];
    /** Normalises a `string | string[]` classList into a clean `string[]`. */
    private normalizeClassList;
    /** Returns the comment (annotation) for a cell, or null if none. Used for [title] tooltip. */
    getCellComment(x: number, y: number): string | null;
    /** Toggle the comment popup when the triangle indicator is clicked. */
    onCommentIndicatorClick(event: MouseEvent, x: number, y: number): void;
    /**
     * Opens the comment popup for cell (x,y) programmatically, auto-positioning it
     * to stay fully visible and (optionally) auto-closing after `duration` ms.
     * Used by `workbook.setCommentsTemporized()` / `showCommentPopup()`.
     */
    openCommentPopup(x: number, y: number, duration?: number): void;
    /**
     * Re-measures the rendered popup and the target cell, then repositions the
     * popup so it is always fully visible: it opens below the cell when there is
     * room, otherwise flips above; horizontally it is clamped inside the viewport.
     */
    private repositionActiveComment;
    /** Schedules a reposition after the popup has rendered (so its size is known). */
    private scheduleCommentReposition;
    /** (Re)arms the auto-close timer for the comment popup. `duration <= 0` keeps it open. */
    private armCommentAutoClose;
    closeComment(): void;
    /** Attacca listener di scroll su tutti i contenitori scrollabili per chiudere il popup commenti. */
    private attachCommentScrollListeners;
    getCellComputedStyle(x: number, y: number): Record<string, string> | null;
    /**
     * Clears the per-cell style/class caches. Called whenever an event changes a
     * cell's appearance (data, styles, classes, config, visibility, sort, resize).
     * Deliberately NOT called on selection/hover, so those frequent passes reuse
     * the cached results.
     */
    private bumpCellRenderCache;
    private getFrozenRowTop;
    private getFrozenColumnLeft;
    /**
     * Sticky `right` offset (px) for a right-frozen column `x`: the sum of the
     * widths of the right-frozen columns positioned to the RIGHT of `x`.
     * Hidden columns render no `<td>` and are therefore skipped, so the offset
     * always matches the real rendered layout. There is no row-header on the
     * right edge, so the offset starts at 0.
     */
    private getFrozenColumnRight;
    isCellCopied(x: number, y: number): boolean;
    select(x: number, y: number, event?: MouseEvent): void;
    selectColumn(x: number, event?: MouseEvent): void;
    isSortableColumn(x: number): boolean;
    isFilterableColumn(x: number): boolean;
    getColumnFilterValue(x: number): string;
    onColumnFilterInput(x: number, value: string): void;
    clearAllColumnFilters(): void;
    getFilterRowCellStyle(x?: number): Record<string, string>;
    /** Sticky style for the filter-row spacer cell above the row-header column. */
    getFilterRowHeaderStyle(): Record<string, string>;
    getSortDirection(x: number): 'asc' | 'desc' | null;
    canDragColumns(): boolean;
    canDragColumnHeader(x: number): boolean;
    canResizeColumns(): boolean;
    canResizeColumnHeader(x: number): boolean;
    onHeaderMouseDown(x: number, event: MouseEvent): void;
    private autoFitColumnWidth;
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
    /** Whether Shift+click multi-selection of rows is enabled via `options.multiSelect`. */
    multiSelectRowsEnabled(): boolean;
    /** Whether Shift+click multi-selection of columns is enabled via `options.multiSelect`. */
    multiSelectColumnsEnabled(): boolean;
    selectAll(): void;
    startMouseSelection(x: number, y: number, event: MouseEvent): void;
    updateMouseSelection(x: number, y: number): void;
    private getCellRangeSelection;
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
    /** Shared immutable result for cells outside the current selection (avoids per-cell allocation). */
    private static readonly NO_CELL_SELECTION;
    /**
     * Returns the full selection state for a cell in a single pass.
     * Collapses the previous `isSelected` + `isSelectionTop/Bottom/Left/Right`
     * (≈6 calls per cell, each re-reading the selection) into one computation,
     * consumed via a single `@let` binding in the template.
     */
    cellSelectionState(x: number, y: number): JxCellSelectionState;
    isSelectionTopCell(x: number, y: number): boolean;
    isSelectionBottomCell(x: number, y: number): boolean;
    isSelectionLeftCell(x: number, y: number): boolean;
    isSelectionRightCell(x: number, y: number): boolean;
    isFillHandleSourceCell(x: number, y: number): boolean;
    isFillPreviewCell(x: number, y: number): boolean;
    /** Shared immutable result for cells outside the fill-preview range (avoids per-cell allocation). */
    private static readonly NO_FILL_PREVIEW;
    /**
     * Returns the full fill-preview state for a cell in a single pass.
     * Collapses `isFillPreviewCell` + the four edge checks (each re-reading the
     * fill bounds, ≈9 reads per cell) into one computation consumed via `@let`.
     */
    cellFillPreviewState(x: number, y: number): JxCellSelectionState;
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
    onInlineComponentMouseUp(event: MouseEvent): void;
    onInlineComponentClick(event: MouseEvent): void;
    private getFillTargetRowFromMouseEvent;
    private getFillTargetColumnFromMouseEvent;
    private getMovementFromKey;
    private computeNextCell;
    private moveFrom;
    private isPrintableEditKey;
    private isHorizontalArrow;
    private isBooleanEditor;
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
    /**
     * Returns a single-element array whose value is the current
     * `columnsPatchVersion` from the workbook service. Used in the template
     * with `*ngFor` + `trackBy: trackByHeaderKey` to force Angular to
     * destroy and recreate the `NgComponentOutlet` (and thus the custom header
     * component instance) whenever columns are replaced via `setConfig`.
     */
    headerOutletKeys(_x: number): [number];
    /** TrackBy for the single-element key array used by `headerOutletKeys`. */
    trackByHeaderKey(_index: number, version: number): number;
    /**
     * Returns a single-element array whose value is the current render epoch for
     * row `y`. Used in the template with `*ngFor` + `trackBy: trackByCellEpoch`
     * to force Angular to destroy and recreate the custom-cell `NgComponentOutlet`
     * (and thus the custom component instance) whenever a structural row change
     * (insert/delete) shifts the row at this position. Recreation re-runs the
     * component's `ngOnInit` (plus any attach-time lifecycle) and re-passes the
     * inputs/context of the row now occupying this position.
     */
    customCellOutletKeys(_x: number, y: number): [number];
    /** TrackBy for the single-element key array used by `customCellOutletKeys`. */
    trackByCellEpoch(_index: number, epoch: number): number;
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
    /** Imposta/rimuove la maschera di input per la colonna `col`. */
    setColumnMask(col: number, mask: string | import('../../models/jx-cell.models').JxMaskConfig | undefined): void;
    /** Restituisce la configurazione maschera della colonna `col` normalizzata, o `null`. */
    getColumnMask(col: number): import('../../models/jx-cell.models').JxMaskConfig | null;
    setLocked(value: boolean): void;
    isLocked(): boolean;
    getColumnOptions(col: number): JxCellColumn<Record<string, any>> | null;
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
    /** Returns the label of the currently active value for a combo item, reading the top-left cell of the selection. */
    getToolbarComboValue(item: import('../../models/jx-cell.models').JxToolbarItem): string;
    /** Applies the selected combo option to all cells in the current selection. */
    onToolbarComboSelect(item: import('../../models/jx-cell.models').JxToolbarItem, opt: import('../../models/jx-cell.models').JxToolbarComboOption): void;
    /** Dispatches a synthetic left-click on the hidden anchor element so ContextMenuDirective opens the menu aligned below the combo button. */
    triggerComboMenu(event: MouseEvent, anchor: HTMLElement): void;
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
    getComments(cellName?: string): string | Record<string, string> | null;
    setComments(cellName: string, comment: string | null): void;
    clearComments(cellName?: string): void;
    /** Sets a comment and opens its popup, auto-closing after `duration` ms (0 = stay open). */
    setCommentsTemporized(cellName: string, comment: string | null, duration?: number): void;
    /** Opens the popup of an existing comment, auto-closing after `duration` ms (0 = stay open). */
    showCommentPopup(cellName: string, duration?: number): void;
    /** Closes any open comment popup. */
    hideCommentPopup(): void;
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
        readonly beforeChange$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxChangePayload>>;
        readonly beforeInsertRow$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxRowOpPayload>>;
        readonly beforeDeleteRow$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxRowOpPayload>>;
        readonly beforeInsertColumn$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxColOpPayload>>;
        readonly beforeDeleteColumn$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxColOpPayload>>;
        readonly beforeMoveColumn$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxMoveColPayload>>;
        readonly beforeMoveRow$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxMoveRowPayload>>;
        readonly beforePaste$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxPastePayload>>;
        readonly beforeMerge$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxMergePayload>>;
        readonly beforeResizeColumn$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxResizeColPayload>>;
        readonly beforeResizeRow$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxResizeRowPayload>>;
        readonly beforeEditionEnd$: import("rxjs").Subject<import("jx-cell").JxCancellableEvent<import("jx-cell").JxBeforeEditionEndPayload>>;
        readonly change$: import("rxjs").Subject<import("jx-cell").JxChangePayload>;
        readonly afterChanges$: import("rxjs").Subject<import("jx-cell").JxAfterChangesPayload>;
        readonly insertRow$: import("rxjs").Subject<import("jx-cell").JxRowOpPayload>;
        readonly deleteRow$: import("rxjs").Subject<import("jx-cell").JxRowOpPayload>;
        readonly insertColumn$: import("rxjs").Subject<import("jx-cell").JxColOpPayload>;
        readonly deleteColumn$: import("rxjs").Subject<import("jx-cell").JxColOpPayload>;
        readonly moveColumn$: import("rxjs").Subject<import("jx-cell").JxMoveColPayload>;
        readonly moveRow$: import("rxjs").Subject<import("jx-cell").JxMoveRowPayload>;
        readonly paste$: import("rxjs").Subject<import("jx-cell").JxPastePayload>;
        readonly merge$: import("rxjs").Subject<import("jx-cell").JxMergePayload>;
        readonly resizeColumn$: import("rxjs").Subject<import("jx-cell").JxResizeColPayload>;
        readonly resizeRow$: import("rxjs").Subject<import("jx-cell").JxResizeRowPayload>;
        readonly selection$: import("rxjs").Subject<JxSelection>;
        readonly editionStart$: import("rxjs").Subject<import("jx-cell").JxEditionStartPayload>;
        readonly editionEnd$: import("rxjs").Subject<import("jx-cell").JxEditionEndPayload>;
        readonly sort$: import("rxjs").Subject<import("jx-cell").JxSortPayload>;
        readonly footerChange$: import("rxjs").Subject<import("jx-cell").JxFooterChangePayload>;
        readonly persist$: import("rxjs").Subject<import("jx-cell").JxPersistPayload>;
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
        readonly tableActivate$: import("rxjs").Subject<void>;
        readonly tableDeactivate$: import("rxjs").Subject<void>;
        readonly data$: import("rxjs").Subject<void>;
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
    /** Restituisce il `name`/`field` della colonna all'indice dato. Inverso di `getColumnByKey`. */
    getColumnKey(index: number): string | undefined;
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
     * Risolve il testo visualizzato (label) di una cella per ricerca e filtri.
     * Gestisce le colonne `autocomplete`, incluse quelle con sorgente **async**,
     * sfruttando la cache delle label popolata durante il rendering
     * (`getAcLabel`/`acFetch`). Restituisce `undefined` quando non sa risolvere,
     * delegando alla logica di default del workbook (dropdown, maschere, ecc.).
     */
    private resolveSearchLabel;
    /**
     * Invalida la cache delle label autocomplete (per colonne con source
     * funzione/async). Al prossimo render le label vengono ri-risolte dalle
     * sorgenti correnti invece di restare "congelate" al primo prefetch.
     *
     * Utile dopo un cambio dati/combo (es. `setConfig` con nuovi valori) per gli
     * id non presenti nella cache iniziale, che altrimenti mostrerebbero il
     * valore grezzo (es. un GUID) al posto della label.
     *
     * @param col - Indice colonna (0-based), oppure `name`/`field` della colonna.
     *              Se omesso, invalida **tutte** le colonne. Se viene passato un
     *              identificatore che non corrisponde a nessuna colonna, non fa
     *              nulla (no-op) invece di invalidare tutto per sicurezza.
     */
    invalidateAutocompleteCache(col?: number | string): void;
    /**
     * Risolve un indice colonna 0-based a partire da un numero (restituito
     * as-is) o da una stringa cercata su `name`/`field` (delega a
     * `JxWorkbookService.getColumnByKey`). Restituisce `null` se non trovato.
     */
    private resolveColumnIndex;
    /**
     * Ripopola subito la cache label delle colonne autocomplete con source
     * funzione (async), riusando la stessa via di prefetch di `getAcLabel`, per
     * evitare il "flash" del valore grezzo dopo un'invalidazione. Non tocca le
     * colonne con `render` (restano prioritarie, vedi `getAcLabel`).
     *
     * @param idx - Colonna specifica, oppure `null`/`undefined` per tutte le
     *              colonne autocomplete.
     */
    private reprefetchVisibleAutocompleteLabels;
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
    /** Normalizza un item grezzo (stringa o JxSourceItem/{id,description?,name?,extras?}) in JxAutocompleteItem. */
    private normalizeAcItem;
    /** Apre/aggiorna il pannello suggerimenti per la cella (x,y) con la query data. */
    acFetch(x: number, y: number, query: string): void;
    /** Chiude il pannello suggerimenti senza salvare. */
    acClose(): void;
    /**
     * Avvia i listener di scroll su tutti i contenitori scrollabili del host
     * (table wrapper, window) in modo che il dropdown `position:fixed` ricalcoli
     * la propria posizione ad ogni scroll mentre il pannello è aperto.
     */
    private attachAcScrollListeners;
    /**
     * Called when the hidden anchor input loses focus.
     * Keeps the overlay open if focus is transitioning to the overlay filter input.
     */
    onAcEditorBlur(): void;
    /**
     * Schedules focus transfer to the overlay filter input, giving Angular one
     * task-queue tick to render the overlay after acFetch sets acState.
     */
    scheduleAcFilterFocus(): void;
    /**
     * Called when the overlay filter input loses focus.
     * Commits the original (unmodified) cell value and closes the overlay.
     */
    onAcFilterBlur(): void;
    /** Keyboard handler for the overlay filter input. */
    onAcFilterKey(event: KeyboardEvent): void;
    /** Stile di posizionamento del dropdown autocomplete rispetto alla cella attiva.
     * Usa `position: fixed` con coordinate viewport-relative in modo da essere
     * sempre allineato alla cella indipendentemente da scroll interni o da
     * contenitori intermedi con overflow.  Gestisce anche il flip verticale
     * (apre verso l'alto se sotto non c'è spazio) e il clamp orizzontale. */
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
    static ɵfac: i0.ɵɵFactoryDeclaration<JxTableComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JxTableComponent<any>, "jx-table", never, { "options": { "alias": "options"; "required": false; }; }, { "ready": "ready"; "selectionChange": "selectionChange"; }, never, never, false, never>;
}
