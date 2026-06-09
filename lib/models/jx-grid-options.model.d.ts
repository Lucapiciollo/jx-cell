/**
 * Configuration object for the `<jx-grid>` component.
 *
 * All properties are optional.  Pass the object via `[options]` binding:
 * ```html
 * <jx-grid [data]="rows" [columns]="cols" [options]="opts"></jx-grid>
 * ```
 */
export interface JxGridOptions {
    /** When `true` cells can be edited by the user. Default: `false`. */
    editable?: boolean;
    /** When `true` clicking a row selects it and emits `rowSelect`. Default: `false`. */
    selectable?: boolean;
    /**
     * When `true` the grid container grows to fit all rows without an internal
     * scrollbar.  Incompatible with `virtualScroll`.
     */
    autoHeight?: boolean;
    /**
     * Fixed row height in pixels.  Used both for CSS row styling and as the
     * step size in the virtual-scroll position calculation.
     * Defaults to `40` when `virtualScroll` is enabled and this is not provided.
     */
    rowHeight?: number;
    /** Message shown in the empty-state row when `data` has no entries. */
    emptyMessage?: string;
    /**
     * Row property name used as a stable identity key for `trackBy`.
     * When provided, Angular reuses DOM nodes for rows with the same key value
     * across re-renders instead of rebuilding them.
     *
     * @example
     * options = { trackByKey: 'id' }
     */
    trackByKey?: string;
    /**
     * Enable virtual scrolling.  Only the rows inside the visible viewport
     * (plus a configurable buffer of 5 rows above and below) are rendered in
     * the DOM.  The scrollbar height reflects the full dataset size via CSS
     * spacer rows.
     *
     * **Requirements**
     * - Set `virtualScrollHeight` (or the container will default to `400px`).
     * - Uniform row height via `rowHeight` gives the best accuracy; mixed heights
     *   are approximated using `rowHeight ?? 40`.
     *
     * **Incompatible with** `autoHeight: true`.
     *
     * @example
     * options = {
     *   virtualScroll: true,
     *   virtualScrollHeight: '500px',
     *   rowHeight: 40,
     * }
     */
    virtualScroll?: boolean;
    /**
     * CSS height of the scrollable container when `virtualScroll` is enabled.
     * Accepts any valid CSS length: `'400px'`, `'60vh'`, `'100%'`, etc.
     * Defaults to `'400px'` when omitted.
     */
    virtualScrollHeight?: string;
}
