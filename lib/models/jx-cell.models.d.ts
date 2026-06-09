import { Type } from '@angular/core';
import { JxCustomCellComponent } from './jx-custom-cell.base';
/**
 * All possible types that can be stored in a grid cell.
 * Custom cell components receive values typed as `JxCellValue`.
 */
export type JxCellValue = string | number | boolean | Date | null | undefined | Record<string, unknown> | JxCellValue[];
/**
 * Spreadsheet cell address in A1 notation (e.g. `'A1'`, `'B3'`, `'AA10'`).
 * Use `JxAddressService.cellName(x, y)` to generate and `JxAddressService.parse()` to convert.
 */
export type JxCellAddress = string;
/** Style properties that can be applied to individual cells, rows, or columns. */
export interface JxCellStyle {
    color?: string;
    backgroundColor?: string;
    fontWeight?: 'bold' | 'normal' | string;
    fontStyle?: 'italic' | 'normal' | string;
    fontFamily?: string;
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right' | string;
    textDecoration?: string;
    /** Border shorthand for all four sides, e.g. "1px solid #000000" */
    border?: string;
    /** Individual side borders — CSS shorthand strings, e.g. "2px dashed #ff0000" */
    borderTop?: string;
    borderBottom?: string;
    borderLeft?: string;
    borderRight?: string;
}
export type JxSortDirection = 'asc' | 'desc' | null;
export interface JxSortState {
    columnIndex: number;
    direction: 'asc' | 'desc';
}
/** Voce normalizzata restituita dall'autocomplete. */
export interface JxAutocompleteItem {
    /** Valore salvato nella cella. */
    id: any;
    /** Testo mostrato nel dropdown. */
    label: string;
}
/**
 * Sorgente per le colonne `autocomplete`.
 * - Array statico di stringhe o oggetti `{id, name}`.
 * - Callback sincrona/asincrona che riceve la query corrente.
 * - Observable (compatibile con RxJS).
 */
export type JxAutocompleteSource = string[] | {
    id: any;
    name: string;
}[] | ((query: string) => string[] | {
    id: any;
    name: string;
}[] | Promise<string[] | {
    id: any;
    name: string;
}[]> | {
    subscribe: (observer: any) => any;
});
/** Contesto passato al `filterFn` di una colonna. */
export interface JxCellFilterContext {
    /** Valore corrente della cella su cui sta lavorando il filterFn. */
    value: any;
    /** Indice colonna (0-based). */
    x: number;
    /** Indice riga (0-based). */
    y: number;
    /** Intera riga grezza. */
    row: readonly any[];
    /** Testo digitato (solo per `autocomplete`, stringa vuota per `dropdown`). */
    query: string;
}
export interface JxCellColumn<T extends Record<string, any> = Record<string, any>> {
    type?: string;
    /** Optional semantic value type used by custom/component cells for validation. */
    valueType?: 'text' | 'number' | 'numeric' | 'boolean' | 'date';
    title?: string;
    name?: keyof T | string;
    field?: keyof T | string;
    width?: number | string;
    /** Allineamento testo nella cella: 'left' | 'center' | 'right'. */
    align?: 'left' | 'center' | 'right' | string;
    readOnly?: boolean;
    readonly?: boolean;
    source?: any[];
    /**
     * Funzione di filtro dinamico delle opzioni.
     * Applicata sia a `dropdown` che ad `autocomplete` (prima della ricerca per testo).
     * Riceve il contesto completo (riga, x, y, query) e deve restituire la lista
     * di item da mostrare (stessa forma di `source`).
     *
     * Esempio — cascading dropdown:
     * ```ts
     * filterFn: ({ row }) => ITEMS.filter(i => i.category === row[2])
     * ```
     */
    filterFn?: (ctx: import('./jx-cell.models').JxCellFilterContext) => any[];
    /**
     * Sorgente suggerimenti per le colonne di tipo `autocomplete`.
     * Può essere:
     * - `string[]` — lista statica di stringhe
     * - `{id: any; name: string}[]` — lista statica con id e label
     * - `(query: string) => string[] | {id:any;name:string}[]` — callback sincrona
     * - `(query: string) => Promise<string[] | {id:any;name:string}[]>` — callback asincrona
     * - `(query: string) => Observable<string[] | {id:any;name:string}[]>` — callback RxJS
     *
     * Se non fornita, la colonna usa `source` (retrocompatibilità con dropdown).
     */
    autocompleteSource?: JxAutocompleteSource;
    mask?: string;
    decimal?: string;
    options?: Record<string, any>;
    editor?: JxCellEditorDefinition;
    /** Enable sorting on this column. Overrides global `options.sortable`. */
    sortable?: boolean;
    /** Se false, questa colonna non mostra l'input nella filter row anche quando `columnFilter` è abilitato. Default: true. */
    filterable?: boolean;
    /** Custom comparator. Receives two full raw rows and the column index. Return negative/0/positive like Array.sort. */
    sortFn?: (rowA: any[], rowB: any[], columnIndex: number) => number;
    /** Se true (o type === 'hidden'), la colonna è completamente nascosta nel DOM. */
    hidden?: boolean;
    /**
     * Custom Angular component rendered inside the header cell of this column.
     * The component receives @Input() context: JxHeaderCellContext.
     * When set, replaces the default title + sort-icon rendering.
     */
    headerComponent?: Type<import('./jx-custom-cell.base').JxCustomHeaderComponent<any>>;
    /**
     * Custom Angular component rendered inside the footer cell(s) of this column.
     * The component receives @Input() context: JxFooterCellContext.
     * When set, replaces the default text rendering in every footer row for this column.
     */
    footerComponent?: Type<import('./jx-custom-cell.base').JxCustomFooterComponent<any>>;
}
/**
 * Context passed to a custom header cell component via @Input() context.
 */
export interface JxHeaderCellContext<T extends Record<string, any> = Record<string, any>> {
    /** 0-based column index. */
    x: number;
    columnIndex: number;
    /** Resolved column title (fallback to letter label). */
    title: string;
    column?: JxCellColumn<T>;
    /** Direct reference to the workbook service. */
    api: any;
    /** Current sort direction for this column, or null if unsorted. */
    sortDirection: 'asc' | 'desc' | null;
    /** Triggers sorting on this column (same as clicking the header). */
    sort: () => void;
    /** The JxSpreadsheetComponent instance. */
    instance: any;
}
/**
 * Context passed to a custom footer cell component via @Input() context.
 */
export interface JxFooterCellContext<T extends Record<string, any> = Record<string, any>> {
    /** Item index inside the footer row array (accounting for colspan). */
    fx: number;
    /** Footer row index (0-based). */
    fy: number;
    /** Logical column index (= sum of preceding colspans in this footer row). */
    logicalCol: number;
    /** Colspan of this footer cell. */
    colspan: number;
    /** Raw footer value (formula string or literal). */
    value: any;
    /** Computed/display footer value. */
    displayValue: any;
    /** Column definition at logicalCol, if available. */
    column?: JxCellColumn<T>;
    /** Direct reference to the workbook service. */
    api: any;
    /** The JxSpreadsheetComponent instance. */
    instance: any;
}
/**
 * Context passed to a custom cell component via `@Input() context`.
 *
 * Custom cell components are Angular components rendered inside data cells when
 * a column has `type: 'custom'` (or when `column.editor.component` is set).
 *
 * The context gives the component full access to the cell position, value,
 * row data, workbook API, and lifecycle methods.
 *
 * @template T  Row shape matching the column's generic parameter.
 *
 * @example
 * // In a custom cell component
 * @Input() context!: JxCustomCellContext;
 *
 * get displayName(): string {
 *   return String(this.context.displayValue ?? '');
 * }
 *
 * save(): void {
 *   this.context.setValue('new value');
 * }
 */
export interface JxCustomCellContext<T extends Record<string, any> = Record<string, any>> {
    /** Zero-based column index of this cell. */
    x: number;
    /** Zero-based row index of this cell. */
    y: number;
    /** Cell address in A1 notation, e.g. `'B3'`. */
    cellName: string;
    /** Raw (unprocessed) cell value — formula strings are returned as-is. */
    value: any;
    /** Evaluated display value (formulas resolved, dropdown labels expanded). */
    displayValue: any;
    /** Full row data — typed as `T` when a row shape is available, otherwise `any[]`. */
    row: T | any[];
    /** Zero-based row index (alias for `y`). */
    rowIndex: number;
    /** Zero-based column index (alias for `x`). */
    columnIndex: number;
    /** Column definition for this cell's column, if configured. */
    column?: JxCellColumn<T>;
    /** Whether the cell is currently in edit mode. */
    editable: boolean;
    /** The `JxWorkbookService` instance (typed as `any` to avoid circular dep — cast in your component). */
    api: any;
    /** The JxSpreadsheetComponent instance — gives access to all public methods. */
    instance: any;
    /** Commits a new value to this cell and exits edit mode. */
    setValue: (value: any) => void;
    /** Returns the current raw value of this cell. */
    getValue: () => any;
    /** Programmatically opens the cell editor (puts the cell into edit mode). */
    startEdit: () => void;
    /** Triggers a full formula recalculation of the grid. */
    recalculate: () => void;
    /** Moves DOM focus to this cell. */
    focusCell: () => void;
}
/**
 * Optional lifecycle hooks for custom cell components.
 * Implement in your class and call `this.wireLifecycle()` in `ngOnInit`
 * to have the base class auto-subscribe to the workbook event bus.
 *
 * All hooks are scoped to the entire grid — filter by `x`/`y` if you only
 * care about the current cell. Return value is ignored; call `e.cancel()`
 * on the event wrapper to block an operation.
 */
export interface JxCellLifecycle {
    /** Before any cell value changes. Call `e.cancel()` to block. */
    jxOnBeforeChange?(e: JxCancellableEvent<JxChangePayload>): void;
    /** After any cell value is committed. */
    jxOnChange?(payload: JxChangePayload): void;
    /** When any cell editor is opened. */
    jxOnEditorOpen?(payload: JxEditionStartPayload): void;
    /** Before any editor commits. Call `e.cancel()` to block, `e.setResult(v)` to transform the value. */
    jxOnBeforeEditorClose?(e: JxCancellableEvent<JxBeforeEditionEndPayload>): void;
    /** After any editor commits. */
    jxOnEditorClose?(payload: JxEditionEndPayload): void;
    /** When the grid selection changes. */
    jxOnSelection?(selection: JxSelection): void;
    /** After a row is inserted or deleted. */
    jxOnRowsChange?(payload: JxRowOpPayload, action: 'insert' | 'delete'): void;
}
export interface JxCellEditorDefinition {
    /** Angular component rendered inside the cell when column.type = 'custom' or when this property is present.
     * The component receives @Input() context: JxCustomCellContext.
     * Uses `any` as generic to allow custom cell components typed with any row type.
     */
    component?: Type<JxCustomCellComponent<any>>;
    createCell?: (...args: any[]) => void;
    updateCell?: (...args: any[]) => void;
    openEditor?: (...args: any[]) => void;
    closeEditor?: (...args: any[]) => any;
    destroyCell?: (...args: any[]) => void;
    getValue?: (...args: any[]) => any;
    setValue?: (...args: any[]) => void;
}
/**
 * Merge value stored internally in the merge map.
 * `[colspan, rowspan]` (minimal form) or `[colspan, rowspan, coveredData]`
 * where `coveredData` is the array of values that were in the covered cells
 * before the merge was applied (used by `removeMerge` to restore them).
 */
export type JxMergeValue = [number, number] | [number, number, any[]];
/**
 * Dictionary mapping cell address strings (e.g. `'A1'`) to their merge info.
 * Only merge **origins** appear as keys; covered cells are implicit.
 *
 * @example
 * const merges: JxMergeMap = { 'A1': [3, 2] }; // A1 spans 3 cols × 2 rows
 */
export type JxMergeMap = Record<string, JxMergeValue>;
export interface JxNestedHeaderCell {
    title: string;
    colspan?: number | string;
    /**
     * Custom Angular component rendered inside this nested-header cell.
     * The component receives `@Input() context: JxNestedHeaderCellContext`.
     * When set, replaces the default title text rendering.
     */
    component?: import('@angular/core').Type<import('./jx-custom-cell.base').JxCustomNestedHeaderComponent<any>>;
}
/**
 * Context passed to a custom nested-header cell component via @Input() context.
 */
export interface JxNestedHeaderCellContext<T extends Record<string, any> = Record<string, any>> {
    /** Row index within nestedHeaders (0-based). */
    rowIndex: number;
    /** Cell index within the row (0-based). */
    cellIndex: number;
    /** First logical column index covered by this cell (= sum of preceding colspans). */
    logicalCol: number;
    /** Colspan of this cell. */
    colspan: number;
    /** Cell title. */
    title: string;
    /**
     * Direct reference to the workbook service (`JxWorkbookService`).
     * Typed as `any` to avoid a circular dependency from the model layer.
     * Cast inside your component when needed:
     * ```ts
     * import { JxWorkbookService } from 'jx-cell';
     * get workbook(): JxWorkbookService { return this.context.api as JxWorkbookService; }
     * ```
     */
    api: any;
    /**
     * The `JxSpreadsheetComponent` instance.
     * Typed as `any` to avoid a circular dependency from the model layer.
     * Cast inside your component when needed:
     * ```ts
     * import { JxSpreadsheetComponent } from 'jx-cell';
     * get sheet(): JxSpreadsheetComponent { return this.context.instance as JxSpreadsheetComponent; }
     * ```
     */
    instance: any;
}
export interface JxFooterCell {
    value: any;
    colspan?: number | string;
}
export interface JxJsonExportOptions {
    processed?: boolean;
    includeHiddenColumns?: boolean;
    includeMergeCells?: boolean;
    includeMeta?: boolean;
}
/** Testi localizzabili dell'UI. Ogni chiave è un testo visibile nell'interfaccia. */
export interface JxCellText {
    noRecordsFound: string;
    show: string;
    entries: string;
    insertANewColumnBefore: string;
    insertANewColumnAfter: string;
    deleteSelectedColumns: string;
    renameThisColumn: string;
    orderAscending: string;
    orderDescending: string;
    insertANewRowBefore: string;
    insertANewRowAfter: string;
    deleteSelectedRows: string;
    editComments: string;
    addComments: string;
    clearComments: string;
    copy: string;
    paste: string;
    saveAs: string;
    about: string;
    areYouSureToDeleteTheSelectedRows: string;
    areYouSureToDeleteTheSelectedColumns: string;
    thisActionWillDestroyAnyExistingMergedCellsAreYouSure: string;
    yesImSure: string;
    notNow: string;
    unfreezeColumns: string;
    freezeColumns: string;
    search: string;
    columns: string;
    rows: string;
    addColumn: string;
    addRow: string;
    /** Pagination label. Use `{0}` for current page and `{1}` for total pages. */
    showingPage: string;
}
export interface JxContextMenuContext {
    /** Indice colonna della cella. */
    x: number;
    /** Indice riga della cella. */
    y: number;
    /** Nome cella in notazione A1. */
    cellName: string;
    /** Valore corrente della cella. */
    value: any;
    /** Dati grezzi dell'intera riga. */
    row: readonly any[];
    /** Definizione della colonna. */
    columnDef: JxCellColumn | null;
    /** Istanza del workbook service per invocare operazioni. */
    workbook: any;
    /**
     * Istanza del componente `JxSpreadsheetComponent`.
     * Permette al template custom di chiamare tutti i metodi pubblici del foglio
     * (es. `instance.copy()`, `instance.selectRow(y)`, `instance.workbook.insertRow(y)`).
     */
    instance: any;
    /** Callback per chiudere il menu (fornita da ux-directives). */
    close: () => void;
}
export interface JxContextMenuOptions {
    /**
     * Disabilita il context menu.
     * - `true`/`false` globale
     * - Callback `(x, y) => boolean` per controllo per-cella.
     * - `'row'` / `'col'` disabilita su header riga/col.
     */
    disabled?: boolean | ((x: number, y: number) => boolean);
    /**
     * Template Angular custom da usare come corpo del menu.
     * Il template riceve come contesto `JxContextMenuContext`.
     * Se non fornito, viene usato il template built-in con le voci standard.
     */
    template?: import('@angular/core').TemplateRef<{
        $implicit: JxContextMenuContext;
        close: () => void;
    }>;
    /**
     * Classi CSS aggiuntive da applicare al pannello del menu.
     * Passate a `[contextMenuClass]` di ux-directives.
     */
    menuClass?: string | string[];
    /**
     * Se false, non mostra le voci built-in (inserisci/elimina riga/col, copia, ecc.).
     * Utile quando si passa un `template` completamente custom.
     * Default: true.
     */
    showDefaultItems?: boolean;
}
/** A single item in the jExcel-compatible built-in toolbar. */
export interface JxToolbarItem {
    /** Item type: 'i' = icon button, 'select' = dropdown, 'color' = color picker, 'divisor' = separator */
    type: 'i' | 'select' | 'color' | 'divisor';
    /** CSS property key applied via setStyle when clicked (e.g. 'font-weight') */
    k?: string;
    /** CSS value applied via setStyle (for type 'i') or list of options (for type 'select') */
    v?: string | string[];
    /** Material icon name displayed inside the button */
    content?: string;
    /** Tooltip text shown on hover */
    tooltip?: string;
    /** Element id */
    id?: string;
    /** Custom click handler — receives (element, workbook, toolbarItem) */
    onclick?: (el: HTMLElement, obj: any, item: HTMLElement) => void;
    /** Custom change handler for type 'select' */
    onchange?: (event: Event) => void;
}
/**
 * Context injected into `JxToolbarPlugin.init()`.
 *
 * Provides the live `JxWorkbookService` so plugins can read the selection,
 * apply styles, subscribe to reactive streams, etc.
 *
 * Import from 'jx-cell':
 * ```ts
 * import { JxToolbarPlugin, JxToolbarPluginContext } from 'jx-cell';
 * ```
 */
export interface JxToolbarPluginContext {
    /**
     * The workbook service bound to the grid instance.
     * Use `workbook.getSelection()`, `workbook.setCellStyle()`, `workbook.resetStyle()`, etc.
     *
     * The type is `any` to avoid a circular dependency from the model layer.
     * Cast to `JxWorkbookService` inside your plugin when needed.
     */
    readonly workbook: any;
}
/**
 * Contract for a custom toolbar plugin.
 *
 * ## How to create a plugin
 *
 * ```ts
 * import {
 *   JxToolbarPlugin,
 *   JxToolbarPluginContext,
 *   JxToolbarItem,
 * } from 'jx-cell';
 *
 * export class MyPlugin implements JxToolbarPlugin {
 *   readonly id = 'my-plugin';
 *   readonly label = 'My Plugin';
 *
 *   private wb: JxToolbarPluginContext['workbook'] | null = null;
 *
 *   init(ctx: JxToolbarPluginContext): void {
 *     this.wb = ctx.workbook;
 *   }
 *
 *   destroy(): void {
 *     this.wb = null;
 *   }
 *
 *   readonly items: JxToolbarItem[] = [
 *     { type: 'divisor' },
 *     {
 *       type: 'i',
 *       content: 'my_icon',
 *       tooltip: 'My action',
 *       onclick: () => {
 *         const sel = this.wb?.getSelection();
 *         if (!sel) return;
 *         // ... apply your logic
 *       },
 *     },
 *   ];
 * }
 * ```
 *
 * ## Registration in the webapp
 *
 * ```ts
 * private readonly myPlugin = new MyPlugin();
 *
 * buildOptions(): JxCellOptions {
 *   return {
 *     ...
 *     toolbarPlugins: [this.myPlugin],
 *   };
 * }
 * ```
 */
export interface JxToolbarPlugin {
    /**
     * Unique identifier for this plugin.
     * Used to deduplicate plugins if `toolbarPlugins` is rebuilt reactively.
     */
    readonly id: string;
    /**
     * Human-readable label (optional).
     * Can be shown as a group title or used for debugging.
     */
    readonly label?: string;
    /**
     * Called once when the grid is ready.
     * Store `ctx.workbook` here to use it inside `items[].onclick` / `items[].onchange`.
     */
    init?(ctx: JxToolbarPluginContext): void;
    /**
     * Called when the grid is destroyed (component OnDestroy).
     * Clean up subscriptions, timers, or references here.
     */
    destroy?(): void;
    /**
     * The toolbar items this plugin contributes.
     * They are appended after `options.toolbar` (built-in items).
     * Items are read at render time so they CAN be a getter that returns a fresh array.
     */
    readonly items: JxToolbarItem[];
}
/**
 * Root configuration object passed to `JxSpreadsheetComponent` via the `[options]` input.
 *
 * All properties are optional.  The minimal working configuration only requires `columns`
 * and either `data` or `url`/`csv`.
 *
 * @template T  Row shape for typed `getJson()` / `getObject()` results.
 *
 * @example
 * const options: JxCellOptions = {
 *   columns: [
 *     { title: 'Name',  name: 'name' },
 *     { title: 'Score', name: 'score', type: 'numeric', width: 80 },
 *   ],
 *   data: [
 *     { name: 'Alice', score: 95 },
 *     { name: 'Bob',   score: 87 },
 *   ],
 *   allowInsertRow: true,
 *   stickyHeader: true,
 *   tableHeight: '400px',
 *   onchange: (wb, el, x, y, value) => console.log('changed', x, y, value),
 * };
 */
export interface JxCellOptions<T extends Record<string, any> = Record<string, any>> {
    /**
     * Grid data.  Accepts either:
     * - `any[][]` — 2-D array of rows × columns (positional values)
     * - `T[]` — array of objects keyed by column `name`/`field`
     */
    data?: T[] | any[][];
    /**
     * Column definitions array.  Each entry configures a grid column:
     * `type`, `title`, `name`/`field`, `width`, `readOnly`, `source`, etc.
     */
    columns?: JxCellColumn<T>[];
    /** Minimum grid dimensions `[columns, rows]`.  Grid is expanded to fit if data is smaller. */
    minDimensions?: [number, number];
    /** Array parallelo a columns[]: titoli delle colonne (compat. jExcel). */
    colHeaders?: string[];
    /** Array parallelo a columns[]: larghezze colonne in px (compat. jExcel). */
    colWidths?: (number | string)[];
    /** Array parallelo a columns[]: allineamento testo (compat. jExcel). */
    colAlignments?: string[];
    /** Larghezza default per le colonne senza width esplicita. Default: 100. */
    defaultColWidth?: number;
    /** Allineamento default per le colonne senza align esplicita. Default: 'left'. */
    defaultColAlign?: 'left' | 'center' | 'right' | string;
    /** Altezza default delle righe in px. Default: 28. */
    defaultRowHeight?: number;
    /** Numero minimo di righe vuote in coda. Aggiunge righe dopo i dati. */
    minSpareRows?: number;
    /** Numero minimo di colonne vuote aggiuntive (compat. jExcel). */
    minSpareCols?: number;
    /** URL remoto da cui caricare i dati JSON all'inizializzazione e su refresh(). */
    url?: string;
    /** Metodo HTTP usato per la richiesta remota. Default: 'GET'. */
    method?: 'GET' | 'POST' | string;
    /** Parametri aggiuntivi inviati con la richiesta (query string per GET, body per POST). */
    requestVariables?: Record<string, any>;
    /** Se true mostra un overlay di caricamento durante il fetch remoto. */
    loadingSpin?: boolean;
    /** URL o stringa CSV da cui caricare i dati all'inizializzazione. */
    csv?: string;
    /** Nome del file CSV generato da download() (senza estensione). Default: 'export'. */
    csvFileName?: string;
    /** Se true, la prima riga del CSV viene usata come intestazioni di colonna. Default: true. */
    csvHeaders?: boolean;
    /** Delimitatore usato nel CSV. Default: ','. */
    csvDelimiter?: string;
    /** Se false, il metodo download() è disabilitato. Default: true. */
    allowExport?: boolean;
    /** Se true, include la riga di intestazione nel CSV scaricato. Default: false. */
    includeHeadersOnDownload?: boolean;
    /** When `false`, all cells are read-only and no editing is possible.  Default: `true`. */
    editable?: boolean;
    /** Mostra/nasconde la riga di intestazione (thead). Default: true. */
    columnHeaders?: boolean;
    /** Mostra/nasconde la riga di piè di pagina (tfoot). Default: true. */
    showFooter?: boolean;
    /** Mostra una riga di input di filtro sotto l'header per filtrare per colonna. Default: false. */
    columnFilter?: boolean;
    /** Mostra/nasconde la colonna degli indici di riga (prima colonna numerica). Default: true. */
    rowHeaders?: boolean;
    /** Numero minimo di righe presenti all'init; aggiunge righe vuote se i dati sono insufficienti. */
    minRows?: number;
    allowInsertRow?: boolean;
    allowInsertColumn?: boolean;
    allowDeleteRow?: boolean;
    allowDeleteColumn?: boolean;
    /** Se false, impedisce di eliminare l'ultima riga rimasta. Default: true. */
    allowDeletingAllRows?: boolean;
    allowRenameColumn?: boolean;
    allowComments?: boolean;
    /** Se true, mostra un pulsante "+" per inserire righe manualmente dalla UI. Default: false. */
    allowManualInsertRow?: boolean;
    /** Se true, mostra un pulsante "+" per inserire colonne manualmente dalla UI. Default: false. */
    allowManualInsertColumn?: boolean;
    /** Se false, disabilita il taglio celle (Ctrl+X). Default: true. */
    allowCut?: boolean;
    /** Se true, include la riga header negli appunti quando si copia. Default: false. */
    includeHeadersOnCopy?: boolean;
    /** Se true, le celle vanno a capo quando il contenuto supera la larghezza. Default: false. */
    wordWrap?: boolean;
    /** Gestione overflow testo: 'clip' | 'ellipsis'. Default: 'clip'. */
    textOverflow?: 'clip' | 'ellipsis' | string;
    /** Se true, converte automaticamente stringhe numeriche/booleane al tipo corretto. Default: false. */
    autoCasting?: boolean;
    /** Se true, blocca l'inserimento di valori che iniziano con '=' provenienti da paste. Default: false. */
    secureFormulas?: boolean;
    /** Se true, rimuove i tag HTML dal testo incollato. Default: false. */
    stripHTML?: boolean;
    /** Se true, rimuove i tag HTML dal testo copiato negli appunti. Default: false. */
    stripHTMLOnCopy?: boolean;
    /** Allow reordering columns by drag-and-drop on the column header.  Default: `false`. */
    columnDrag?: boolean;
    /** Allow resizing columns by dragging the header border.  Default: `true`. */
    columnResize?: boolean;
    /** Allow reordering rows by drag-and-drop on the row header.  Default: `false`. */
    rowDrag?: boolean;
    /** Allow resizing rows by dragging the row-header border.  Default: `false`. */
    rowResize?: boolean;
    /** Show the corner fill handle for drag-fill operations.  Default: `true`. */
    enableFillHandle?: boolean;
    /** Number of rows to freeze (always visible during vertical scroll). */
    freezeRows?: number;
    /** Number of columns to freeze from the left (always visible during horizontal scroll). */
    freezeColumns?: number;
    /** Explicit array of column indices to freeze (alternative to `freezeColumns`). */
    frozenColumnIndexes?: number[];
    /** Se `true`, l'header rimane visibile durante lo scroll verticale. Richiede `tableHeight`. */
    stickyHeader?: boolean;
    /** Se `true`, il footer rimane visibile durante lo scroll verticale. Richiede `tableHeight`. */
    stickyFooter?: boolean;
    /** When `true` the table container shows a scrollbar and the content overflows.  Required for `stickyHeader`/`stickyFooter`. */
    tableOverflow?: boolean;
    /** CSS width of the table container (e.g. `'100%'`, `800` for px).  Requires `tableOverflow: true`. */
    tableWidth?: string | number;
    /** CSS height of the table container.  Enables vertical scrolling.  Requires `tableOverflow: true`. */
    tableHeight?: string | number;
    /** Number of rows per pagination page.  Set to 0 or omit to disable pagination. */
    pagination?: number;
    /** Show the built-in search box above the grid.  Default: `false`. */
    search?: boolean;
    /** Reserved / not yet implemented.  Accepted for jSpreadsheet compat. */
    tabs?: boolean;
    /**
     * Footer data rows.  Alias: `footer` (singular).
     * Accepts the same formats as `data`: plain values, formula strings, or
     * `JxFooterCell` objects for colspan and custom component rendering.
     */
    footers?: any[][];
    /** Alias for `footers`. */
    footer?: any[][];
    /** Nested header rows rendered above the main column header.  Each entry is an array of `JxNestedHeaderCell`. */
    nestedHeaders?: JxNestedHeaderCell[][] | Array<Array<{
        title: string;
        colspan?: number | string;
    }>> | any[];
    /**
     * Initial cell merge map.  Keys are cell addresses (e.g. `'A1'`); values are
     * `[colspan, rowspan]` tuples.
     *
     * @example
     * mergeCells: { 'A1': [3, 2] } // A1 spans 3 columns × 2 rows
     */
    mergeCells?: JxMergeMap;
    /**
     * Initial per-cell style overrides.  Keys are cell addresses in A1 notation;
     * values are `JxCellStyle` CSS-property objects.
     *
     * @example
     * style: { 'A1': 'font-weight: bold; color: red;' }
     */
    style?: Record<string, string>;
    /**
     * Initial cell metadata map.  Keys are cell addresses; values are arbitrary
     * objects (tooltips, notes, validation state, etc.).
     *
     * @example
     * meta: { 'A1': { tooltip: 'Required field' } }
     */
    meta?: Record<string, any>;
    /** Fired after any cell value changes.  Signature mirrors jSpreadsheet. */
    onchange?: (...args: any[]) => void;
    /** Pre-event fired before a cell value is committed.  Return `false` to cancel or a new value to override. */
    onbeforechange?: (...args: any[]) => any;
    /** Fired after a batch of cell changes completes (e.g. paste, fill). */
    onafterchanges?: (...args: any[]) => void;
    /** Fired whenever the selection rectangle changes. */
    onselection?: (...args: any[]) => void;
    /** Fired when a cell editor is opened (user starts editing). */
    oneditionstart?: (...args: any[]) => void;
    /** Fired when a cell editor closes and the value is committed. */
    oneditionend?: (...args: any[]) => void;
    /** Fired after the DOM editor element is created (jSpreadsheet compat). */
    oncreateeditor?: (...args: any[]) => void;
    /** Pre-event: return false to cancel row insertion. */
    onbeforeinsertrow?: (el: null, rowIndex: number, amount: number) => boolean | void;
    oninsertrow?: (el: null, rowIndex: number, amount: number) => void;
    /** Pre-event: return false to cancel row deletion. */
    onbeforedeleterow?: (el: null, rowIndex: number, amount: number) => boolean | void;
    ondeleterow?: (el: null, rowIndex: number, amount: number) => void;
    /** Pre-event: return false to cancel column insertion. */
    onbeforeinsertcolumn?: (el: null, colIndex: number, amount: number) => boolean | void;
    oninsertcolumn?: (el: null, colIndex: number, amount: number) => void;
    /** Pre-event: return false to cancel column deletion. */
    onbeforedeletecolumn?: (el: null, colIndex: number, amount: number) => boolean | void;
    ondeletecolumn?: (el: null, colIndex: number, amount: number) => void;
    /** Pre-event: return false to cancel column move. */
    onbeforemovecolumn?: (el: null, from: number, to: number) => boolean | void;
    onmovecolumn?: (el: null, from: number, to: number) => void;
    /** Pre-event: return false to cancel row move. */
    onbeforemoverow?: (el: null, from: number, to: number) => boolean | void;
    onmoverow?: (el: null, from: number, to: number) => void;
    /** Pre-event: return false to cancel column resize. */
    onbeforeresizecolumn?: (el: null, colIndex: number, width: number) => boolean | void;
    onresizecolumn?: (...args: any[]) => void;
    /** Pre-event: return false to cancel row resize. */
    onbeforeresizerow?: (el: null, rowIndex: number, height: number) => boolean | void;
    onresizerow?: (...args: any[]) => void;
    /** Pre-event: return false to cancel paste. onbeforepaste can also return a modified data array. */
    onbeforepaste?: (el: null, data: any[][], startX: number, startY: number) => any[][] | false | void;
    onpaste?: (el: null, data: any[][], startX: number, startY: number) => void;
    /** Pre-event: return false to cancel merge. */
    onbeforemerge?: (el: null, cellName: string, colspan: number, rowspan: number) => boolean | void;
    onmerge?: (...args: any[]) => void;
    onfooterchange?: (...args: any[]) => void;
    /** Enable sorting on all columns by default. Individual columns can override with column.sortable. */
    sortable?: boolean;
    onsort?: (columnIndex: number, direction: 'asc' | 'desc') => void;
    /**
     * Se true, aggiunge automaticamente una riga vuota in coda ogni volta che
     * tutte le righe presenti hanno almeno una cella popolata.
     */
    autoAddRow?: boolean;
    /**
     * Se true, il fill-handle incrementa automaticamente i valori numerici e le
     * stringhe con numero finale (es. "Item 1" → "Item 2" → "Item 3").
     * Con un range di 2+ celle rileva il passo (step = val[1] − val[0]).
     * Default: false (copia semplice, come jExcel senza opzione).
     */
    autoIncrement?: boolean;
    /**
     * Configurazione del context menu (tasto destro) sulle celle.
     * Se non impostato, il context menu non è attivo.
     */
    contextMenu?: JxContextMenuOptions;
    /**
     * Ogni chiave corrisponde a un testo usato nel template del componente.
     */
    text?: Partial<JxCellText>;
    /**
     * Mapping colonna → stringa di classi CSS extra da applicare alle celle di quella colonna.
     * Chiave: indice colonna (stringa o numero). Valore: classi CSS spazio-separati.
     * Es: { 0: 'highlight bold', 2: 'danger' }
     */
    classes?: Record<string | number, string>;
    /**
     * Callback chiamata dopo ogni render della tabella.
     * Riceve l'istanza del service così da permettere styling/logica custom.
     */
    updateTable?: (instance: any, cell: HTMLElement, col: number, row: number, value: any, label: string, cellName: string) => void;
    /**
     * Comportamento delle righe non corrispondenti alla ricerca.
     * - `'hide'`: le righe vengono nascoste completamente (default).
     * - `'dim'`: le righe vengono opacizzate con il valore `searchDimOpacity`.
     */
    searchMode?: 'hide' | 'dim';
    /**
     * Opacità applicata alle righe non corrispondenti quando `searchMode = 'dim'`.
     * Valore da 0 (invisibile) a 1 (normale). Default: 0.2.
     */
    searchDimOpacity?: number;
    /**
     * Chiave localStorage per la persistenza automatica dei dati.
     * Se impostata, i dati vengono salvati ad ogni modifica e ripristinati all'inizializzazione.
     * Corrisponde all'opzione `persistance` di jExcel (con correzione ortografica).
     */
    persistence?: string;
    /**
     * Callback opzionale invocata ogni volta che i dati vengono salvati in localStorage.
     * Riceve la chiave di persistenza usata.
     */
    onpersist?: (key: string) => void;
    /**
     * Catch-all: chiamata per ogni evento emesso dalla griglia.
     * Primo argomento = nome evento (es. 'onchange'); i successivi = argomenti specifici dell'evento.
     * Se restituisce false, l'evento è annullato (solo per eventi before*).
     */
    onevent?: (eventName: string, ...args: any[]) => any;
    /** Alias of `sortable`. Allow column sorting. Default: true. */
    columnSorting?: boolean;
    /** Custom sort comparator function. Receives two cell values, returns -1/0/1. */
    sorting?: ((a: any, b: any) => number) | null;
    /**
     * When true, copy uses plain text compatible with older spreadsheets
     * (tab-separated, no rich formatting). Default: false.
     */
    copyCompatibility?: boolean;
    /**
     * Internal root element reference (jExcel compat). Not used by jx-cell.
     */
    root?: HTMLElement | null;
    /**
     * When false, the corner fill handle is hidden and range-copy is disabled.
     * Default: true.
     */
    selectionCopy?: boolean;
    /** When true, formula expressions are evaluated on render. Default: true. */
    parseFormulas?: boolean;
    /**
     * When true, enable lazy loading of rows (virtual scrolling).
     * Currently a stub — rows are not virtualised but the option is accepted for compat.
     */
    lazyLoading?: boolean;
    /**
     * When true the grid enters fullscreen mode on init.
     * Can also be toggled at runtime via `fullscreen()`.
     */
    fullscreen?: boolean;
    /**
     * Advanced filter UI config (stub — column filters are used instead).
     * Accepted for jExcel compat; set to `true` to enable the filter row.
     */
    filters?: boolean;
    /**
     * Built-in toolbar definition (stub — no built-in toolbar rendered).
     * Accepted for jExcel compat.
     */
    toolbar?: JxToolbarItem[] | null;
    /**
     * External toolbar plugins whose items are merged after `options.toolbar`.
     *
     * Each plugin's `init(ctx)` is called when the grid is ready and
     * `destroy()` is called on `ngOnDestroy`.
     *
     * ```ts
     * toolbarPlugins: [new ClearFormattingPlugin(), new ExportCsvPlugin()]
     * ```
     */
    toolbarPlugins?: JxToolbarPlugin[];
    /**
     * Pagination row count per page. When set, only `pagination` rows are shown
     * at a time (stub — full pagination not yet implemented).
     */
    paginationOptions?: {
        items?: number;
        [key: string]: any;
    } | null;
    /**
     * First row of an HTML `<table>` is parsed as column headers.
     * Used by `createFromTable()` (compat stub). Default: false.
     */
    parseTableFirstRowAsHeader?: boolean;
    /**
     * Automatically detect cell type from HTML table cell content.
     * Used by `createFromTable()` (compat stub). Default: false.
     */
    parseTableAutoCellType?: boolean;
    /**
     * Custom image options for cells of type `image`.
     * @example { width: 200, height: 150 }
     */
    imageOptions?: {
        width?: number;
        height?: number;
        [key: string]: any;
    } | null;
    /**
     * When true, detach the HTML table while running updateTable() for better performance.
     * Compat stub — no-op in jx-cell. Default: false.
     */
    detachForUpdates?: boolean;
    /**
     * Columns that are exempt from resizing.
     * @example [0, 2] — first and third columns cannot be resized.
     */
    columnFreeForResizing?: number[];
    /** Fired after the grid is fully initialised. */
    onload?: (...args: any[]) => void;
    /** Fired when the user cancels cell editing (Escape). */
    onCancelCell?: (...args: any[]) => void;
    /** Fired when `destroy()` is called. */
    onDestroy?: (...args: any[]) => void;
    /** Fired when column width is reset/changed via `setWidth()`. */
    onResetcolumnWidth?: (el: null, col: number, width: number) => void;
    /** Fired when `resetSelection()` is called. */
    onResetSelection?: (...args: any[]) => void;
    /** Fired when the page changes (pagination). */
    onchangepage?: (el: null, page: number, oldPage: number) => void;
    /** Fired after style is applied to a cell. */
    onchangestyle?: (el: null, cellName: string | null, style: any) => void;
    /** Fired when a new selection starts. */
    onselectstart?: (el: null, x1: number, y1: number, x2: number, y2: number) => void;
    /** Fired when the grid is destroyed / closed. */
    onclose?: (...args: any[]) => void;
    /** Fired when a comment is added or removed via `setComments()`. */
    oncomments?: (el: null, cellName: string, comment: string | null) => void;
    /** Fired after a successful undo. */
    onundo?: (...args: any[]) => void;
    /** Fired after a successful redo. */
    onredo?: (...args: any[]) => void;
    /** Fired just before `saveState()` writes to localStorage. */
    onbeforesave?: (key: string) => void;
    /** Fired after `saveState()` successfully writes to localStorage. */
    onsave?: (key: string) => void;
    /** Fired when the header title changes via `setHeader()`. */
    onchangeheader?: (el: null, col: number, newTitle: string, oldTitle: string) => void;
    /** Fired when the copy/cut operation completes. */
    oncopy?: (...args: any[]) => void;
    [key: string]: any;
}
export interface JxCellChangeEvent<T extends Record<string, any> = Record<string, any>> {
    row: T | any[];
    rowIndex: number;
    columnIndex: number;
    field?: string;
    oldValue: any;
    newValue: any;
    cellName: string;
}
export interface JxSelection {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface JxMergeInfo {
    cellName: string;
    x: number;
    y: number;
    colspan: number;
    rowspan: number;
}
/**
 * Wrapper per eventi cancellabili.
 * Chiama `cancel()` per bloccare l'operazione; `setResult(v)` per trasformare il valore di ritorno
 * (es: nuovo valore in beforeChange, dati modificati in beforePaste).
 */
export interface JxCancellableEvent<T = unknown> {
    readonly data: T;
    cancelled: boolean;
    /** Valore di ritorno opzionale: se impostato sovrascrive il valore di default (es. nuovo valore cella). */
    result: any;
    cancel(): void;
    setResult(value: any): void;
}
export interface JxChangePayload {
    x: number;
    y: number;
    cellName: string;
    value: any;
    oldValue: any;
    /** Definizione della colonna (tipo, titolo, width, ecc.) — null se non configurata. */
    columnDef: JxCellColumn | null;
    /** Snapshot dell'intera riga al momento dell'evento (valori grezzi). */
    rowData: readonly any[];
}
export interface JxAfterChangesPayload {
    changes: Array<{
        x: number;
        y: number;
        name: string;
        oldValue: any;
        newValue: any;
    }>;
}
export interface JxRowOpPayload {
    rowIndex: number;
    amount: number;
    /** Numero totale di righe al momento in cui l'evento viene emesso. */
    rowCount: number;
    /** Snapshot delle righe interessate (popolato per delete; per insert = righe appena inserite). */
    affectedRows: readonly any[][];
}
export interface JxColOpPayload {
    colIndex: number;
    amount: number;
    /** Numero totale di colonne al momento in cui l'evento viene emesso. */
    colCount: number;
    /** Definizioni delle colonne interessate dall'operazione. */
    affectedCols: readonly (JxCellColumn | null)[];
    /** Dati delle colonne interessate: affectedColData[rowIndex][colOffset]. */
    affectedColData: readonly any[][];
}
/** Payload per beforeMoveColumn$ / moveColumn$. */
export interface JxMoveColPayload {
    from: number;
    to: number;
    /** Definizione della colonna spostata. */
    columnDef: JxCellColumn | null;
}
/** Payload per beforeMoveRow$ / moveRow$. */
export interface JxMoveRowPayload {
    from: number;
    to: number;
    /** Snapshot dei valori della riga spostata. */
    rowData: readonly any[];
}
/** @deprecated usa JxMoveColPayload o JxMoveRowPayload. */
export type JxMovePayload = JxMoveColPayload | JxMoveRowPayload;
export interface JxResizeColPayload {
    colIndex: number;
    width: number;
    /** Larghezza della colonna prima del resize. */
    oldWidth: number;
    /** Definizione della colonna ridimensionata. */
    columnDef: JxCellColumn | null;
}
export interface JxResizeRowPayload {
    rowIndex: number;
    height: number;
    /** Altezza della riga prima del resize. */
    oldHeight: number;
    /** Snapshot dei valori della riga ridimensionata. */
    rowData: readonly any[];
}
export interface JxPastePayload {
    data: any[][];
    startX: number;
    startY: number;
    /** Colonna finale del blocco incollato (inclusa). */
    endX: number;
    /** Riga finale del blocco incollato (inclusa). */
    endY: number;
}
export interface JxMergePayload {
    cellName: string;
    colspan: number;
    rowspan: number;
    /** Coordinata X (colonna) della cella di origine. */
    x: number;
    /** Coordinata Y (riga) della cella di origine. */
    y: number;
}
export interface JxEditionStartPayload {
    x: number;
    y: number;
    /** Nome della cella in notazione A1. */
    cellName: string;
    /** Valore corrente della cella al momento dell'apertura dell'editor. */
    currentValue: any;
    /** Definizione della colonna. */
    columnDef: JxCellColumn | null;
}
export interface JxBeforeEditionEndPayload {
    x: number;
    y: number;
    value: any;
    save: boolean;
    /** Nome della cella in notazione A1. */
    cellName: string;
    /** Valore precedente alla modifica. */
    oldValue: any;
    /** Definizione della colonna. */
    columnDef: JxCellColumn | null;
}
export interface JxEditionEndPayload {
    x: number;
    y: number;
    value: any;
    save: boolean;
    /** Nome della cella in notazione A1. */
    cellName: string;
    /** Valore precedente alla modifica. */
    oldValue: any;
    /** Definizione della colonna. */
    columnDef: JxCellColumn | null;
}
export interface JxFooterChangePayload {
    row: number;
    col: number;
    value: any;
    /** Valore del footer prima della modifica. */
    oldValue: any;
}
export interface JxSortPayload {
    columnIndex: number;
    direction: 'asc' | 'desc';
    /** Titolo visualizzato della colonna ordinata. */
    columnTitle: string;
    /** Definizione della colonna ordinata. */
    columnDef: JxCellColumn | null;
}
export interface JxPersistPayload {
    key: string;
}
