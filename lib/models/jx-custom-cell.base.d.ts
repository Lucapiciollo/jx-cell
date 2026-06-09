import { Subscription } from 'rxjs';
import { JxCustomCellContext, JxFooterCellContext, JxHeaderCellContext, JxNestedHeaderCellContext } from './jx-cell.models';
import * as i0 from "@angular/core";
/**
 * Minimal contract that every custom body-cell Angular component must satisfy.
 * The library instantiates the component via `ngComponentOutlet` and injects
 * `context` through the `inputs` binding.
 *
 * Prefer extending `JxCustomCellBase` instead of implementing this directly.
 */
export interface JxCustomCellComponent<T extends Record<string, any> = Record<string, any>> {
    /** Full context object injected by the grid into the custom component. */
    context: JxCustomCellContext<T>;
}
/**
 * Minimal contract that every custom header-cell Angular component must satisfy.
 * The library instantiates the component via `ngComponentOutlet` and injects
 * `context` through the `inputs` binding.
 *
 * Prefer extending `JxCustomHeaderBase` instead of implementing this directly.
 */
export interface JxCustomHeaderComponent<T extends Record<string, any> = Record<string, any>> {
    /** Full context object injected by the grid into the custom header component. */
    context: JxHeaderCellContext<T>;
}
/**
 * Minimal contract that every custom nested-header-cell Angular component must satisfy.
 * The library instantiates the component via `ngComponentOutlet` and injects
 * `context` through the `inputs` binding.
 *
 * Prefer extending `JxCustomNestedHeaderBase` instead of implementing this directly.
 */
export interface JxCustomNestedHeaderComponent<T extends Record<string, any> = Record<string, any>> {
    /** Full context object injected by the grid into the custom nested-header component. */
    context: JxNestedHeaderCellContext<T>;
}
/**
 * Minimal contract that every custom footer-cell Angular component must satisfy.
 * The library instantiates the component via `ngComponentOutlet` and injects
 * `context` through the `inputs` binding.
 *
 * Prefer extending `JxCustomFooterBase` instead of implementing this directly.
 */
export interface JxCustomFooterComponent<T extends Record<string, any> = Record<string, any>> {
    /** Full context object injected by the grid into the custom footer component. */
    context: JxFooterCellContext<T>;
}
/**
 * Base class for Angular custom cells.
 *
 * Usage in an Angular component:
 *
 * export class MyCellComponent extends JxCustomCellBase<MyRow> {
 *   @Input() override context: JxCustomCellContext<MyRow> = undefined!;
 * }
 *
 * The base class intentionally does not decorate `context` with @Input().
 * The concrete Angular component must declare @Input() so Angular can bind it.
 */
export declare abstract class JxCustomCellBase<T extends Record<string, any> = Record<string, any>> implements JxCustomCellComponent<T> {
    context: JxCustomCellContext<T>;
    /** Internal subscription bag — managed by wireLifecycle() / ngOnDestroy(). */
    protected readonly _lifeSub: Subscription;
    /**
     * Unsubscribes all lifecycle listeners.
     * If you override `ngOnDestroy` in a subclass, call `super.ngOnDestroy()`.
     */
    ngOnDestroy(): void;
    /**
     * Call this in your component’s `ngOnInit` to auto-wire all `jxOn*` hooks
     * you have overridden to the workbook event bus.
     *
     * Only hooks that are actually defined on the instance are subscribed,
     * so unused events produce zero subscriptions.
     *
     * @example
     * ngOnInit() { this.wireLifecycle(); }
     */
    protected wireLifecycle(): void;
    /** Raw cell value as stored in the workbook (formula strings returned as-is). */
    get value(): any;
    /** Formatted/display value for the cell. Falls back to `value` when no display value is set. */
    get displayValue(): any;
    /** All raw data for the current row as an array or typed object. */
    get row(): T | any[];
    /** 0-based column index of this cell. */
    get x(): number;
    /** 0-based row index of this cell. */
    get y(): number;
    /** A1-style cell address, e.g. `'B3'`. */
    get cellName(): string;
    /** Column definition (`JxCellColumn`) for this cell, or `undefined` if not configured. */
    get column(): any;
    /** Whether the cell is currently editable (not read-only and grid editable). */
    get editable(): boolean;
    /** Returns true only when the cell can be edited. */
    protected canEdit(): boolean;
    /** Read the latest value from the workbook/context. */
    protected getValue(): any;
    /**
     * Set the raw cell value through the official context API.
     * This keeps the library in control of change events, focus and formula refresh.
     */
    protected setValue(value: any): void;
    /**
     * Set value and immediately recalculate formulas, then optionally return
     * focus to the cell so the user can continue keyboard navigation.
     *
     * This is the recommended way to commit a value from a custom cell — it
     * handles change events, formula refresh, and focus in one step.
     *
     * @param value     - The new cell value to commit.
     * @param focusBack - When `true` (default) DOM focus returns to the cell.
     *
     * @example
     * // In a custom cell component
     * onSave(newValue: string): void {
     *   this.commitValue(newValue);
     * }
     */
    protected commitValue(value: any, focusBack?: boolean): void;
    /** Request formula recalculation. */
    protected recalculate(): void;
    /** Give focus back to the table cell. */
    protected focusCell(): void;
    /** Delegate to the default grid editor. */
    protected startEdit(): void;
    /** Helper for button/keyboard events inside custom components. */
    protected stopEvent(event?: Event): void;
    /**
     * Called by a custom component template when Enter/Space should activate the custom cell.
     * Override in the concrete component when needed.
     */
    onActivate(event?: Event): void;
    /** Optional lifecycle hook for implementations. */
    onCellAttached(): void;
    /** Optional lifecycle hook for implementations. */
    onCellDetached(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCustomCellBase<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<JxCustomCellBase<any>, never, never, {}, {}, never, never, true, never>;
}
/**
 * Base class for Angular custom header-cell components.
 *
 * Usage:
 * ```ts
 * @Component({ standalone: false, template: `<b>{{ title }}</b>` })
 * export class MyHeaderComponent extends JxCustomHeaderBase<MyRow> {
 *   @Input() override context!: JxHeaderCellContext<MyRow>;
 * }
 * ```
 * Then set `column.headerComponent = MyHeaderComponent`.
 */
export declare abstract class JxCustomHeaderBase<T extends Record<string, any> = Record<string, any>> implements JxCustomHeaderComponent<T> {
    /** Full context injected by the grid. Must be re-declared with `@Input()` in the concrete component. */
    context: JxHeaderCellContext<T>;
    /** Resolved column title (falls back to the letter label, e.g. `'A'`). */
    get title(): string;
    /** 0-based column index. */
    get columnIndex(): number;
    /** Current sort direction for this column, or `null` if unsorted. */
    get sortDirection(): 'asc' | 'desc' | null;
    /** Column definition (`JxCellColumn`) for this header, or `undefined` if not configured. */
    get column(): any;
    /** Triggers a sort cycle on this column (asc → desc → original order). */
    sort(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCustomHeaderBase<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<JxCustomHeaderBase<any>, never, never, {}, {}, never, never, true, never>;
}
/**
 * Base class for Angular custom nested-header cell components.
 *
 * Usage:
 * ```ts
 * @Component({ standalone: false, template: `<b>{{ title }}</b>` })
 * export class MyNestedHeaderComponent extends JxCustomNestedHeaderBase<MyRow> {
 *   @Input() override context!: JxNestedHeaderCellContext<MyRow>;
 * }
 * ```
 * Then set `nestedHeaders[rowIndex][cellIndex].component = MyNestedHeaderComponent`.
 */
export declare abstract class JxCustomNestedHeaderBase<T extends Record<string, any> = Record<string, any>> implements JxCustomNestedHeaderComponent<T> {
    /** Full context injected by the grid. Must be re-declared with `@Input()` in the concrete component. */
    context: JxNestedHeaderCellContext<T>;
    /** Text title of this nested-header cell. */
    get title(): string;
    /** 0-based index of the `nestedHeaders` row that contains this cell. */
    get rowIndex(): number;
    /** 0-based index of this cell within its `nestedHeaders` row. */
    get cellIndex(): number;
    /** Logical column index of the first data column covered by this cell
     * (= sum of all preceding `colspan` values in the same row). */
    get logicalCol(): number;
    /** Number of data columns this cell spans. */
    get colspan(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCustomNestedHeaderBase<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<JxCustomNestedHeaderBase<any>, never, never, {}, {}, never, never, true, never>;
}
/**
 * Base class for Angular custom footer-cell components.
 *
 * Usage:
 * ```ts
 * @Component({ standalone: false, template: `...` })
 * export class MyFooterComponent extends JxCustomFooterBase {
 *   @Input() override context: JxFooterCellContext = undefined!;
 * }
 * ```
 * Then set `column.footerComponent = MyFooterComponent`.
 */
export declare abstract class JxCustomFooterBase<T extends Record<string, any> = Record<string, any>> implements JxCustomFooterComponent<T> {
    /** Full context injected by the grid. Must be re-declared with `@Input()` in the concrete component. */
    context: JxFooterCellContext<T>;
    /** Logical column index (= sum of preceding `colspan` values in this footer row). */
    get logicalCol(): number;
    /** 0-based item index within the footer row array. */
    get fx(): number;
    /** 0-based footer row index. */
    get fy(): number;
    /** Computed/resolved display value (formulas already evaluated). */
    get displayValue(): any;
    /** Raw footer value as declared in `options.footers` (may be a formula string). */
    get rawValue(): any;
    /** Number of data columns this footer cell spans. */
    get colspan(): number;
    /** Column definition (`JxCellColumn`) at `logicalCol`, if available. */
    get column(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCustomFooterBase<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<JxCustomFooterBase<any>, never, never, {}, {}, never, never, true, never>;
}
