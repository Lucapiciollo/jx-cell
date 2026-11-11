import { InjectionToken } from '@angular/core';
/**
 * A single icon value.
 *
 * Can be a plain glyph (`'▲'`), an HTML entity (`'&#x2398;'`), arbitrary HTML
 * markup (`'<i class="fa fa-copy"></i>'`) or an inline SVG string
 * (`'<svg ...>...</svg>'`). The value is rendered through `[innerHTML]` so
 * SVG / icon-font markup is supported.
 *
 * Because the value is provided by the application developer (not by end-user
 * input) it is trusted and rendered without sanitisation.
 */
export type JxIconValue = string;
/**
 * A set of icons for a single component, keyed by icon key.
 *
 * Example: `{ sortAsc: '▲', sortDesc: '▼' }`.
 */
export type JxComponentIconSet = Record<string, JxIconValue>;
/**
 * The full icon set, grouped by **component name** → **icon key** → value.
 *
 * The component name lets you tell at a glance which component an icon belongs
 * to, e.g. `{ 'jx-table': { sortAsc: '▲' } }`.
 */
export type JxIconSet = Record<string, JxComponentIconSet>;
/**
 * Partial override of {@link JxIconSet}.
 *
 * Provide only the component / key combinations you want to customise — any key
 * you omit falls back to the built-in default ({@link JX_DEFAULT_ICONS}).
 */
export type JxIconOverrides = {
    [component: string]: Partial<JxComponentIconSet> | undefined;
};
/**
 * Icon keys used by the `jx-table` component. Exposed as a string-literal union
 * so consumers get autocomplete when overriding.
 */
export type JxTableIconKey = 'sortAsc' | 'sortDesc' | 'sortNone' | 'comboArrow' | 'contextCopy' | 'contextPaste' | 'contextInsertRowBefore' | 'contextInsertRowAfter' | 'contextDeleteRows' | 'contextInsertColumnBefore' | 'contextInsertColumnAfter' | 'contextDeleteColumns' | 'contextOrderAsc' | 'contextOrderDesc' | 'filterPlaceholder' | 'filterIndicator' | 'pageFirst' | 'pagePrevious' | 'pageNext' | 'pageLast' | 'addColumn' | 'commentClose';
/**
 * Built-in default icon set used when no override is supplied for a given
 * component / key. Values match the glyphs that were previously hard-coded in
 * the component templates.
 */
export declare const JX_DEFAULT_ICONS: JxIconSet;
/**
 * Angular `InjectionToken` used to override the built-in icons of `jx-cell`
 * components.
 *
 * Provide a {@link JxIconOverrides} map keyed by **component name** then
 * **icon key**. Any key you do not provide falls back to the system default
 * ({@link JX_DEFAULT_ICONS}).
 *
 * @example
 * // app.module.ts
 * import { JX_ICONS } from 'jx-cell';
 *
 * @NgModule({
 *   providers: [
 *     {
 *       provide: JX_ICONS,
 *       useValue: {
 *         'jx-table': {
 *           sortAsc: '<svg viewBox="0 0 24 24">…</svg>',
 *           sortDesc: '<i class="fa fa-arrow-down"></i>',
 *           // every other key keeps its default
 *         },
 *       },
 *     },
 *   ],
 * })
 * export class AppModule {}
 */
export declare const JX_ICONS: InjectionToken<JxIconOverrides>;
