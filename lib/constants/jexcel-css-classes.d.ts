/**
 * Exhaustive list of CSS class names used by jSpreadsheet (jExcel) v4 in its
 * rendered DOM.  Sourced from the original `jexcel.js` v4 source file.
 *
 * The `JexcelCssClass` union type is derived from this array so any template
 * class binding can be statically checked against the known set.
 *
 * @example
 * // Type-checked class binding in a template
 * const cls: JexcelCssClass = 'highlight';
 */
export declare const JEXCEL_CSS_CLASSES: readonly ["arrow-down", "arrow-up", "color", "copying", "copying-bottom", "copying-left", "copying-right", "copying-top", "custom-checkbox-width", "draggable", "dragging", "dragging-left", "dragging-right", "editor", "fullscreen", "highlight", "highlight-bottom", "highlight-left", "highlight-right", "highlight-selected", "highlight-top", "jclose", "jexcel", "jexcel_about", "jexcel_column_filter", "jexcel_comments", "jexcel_container", "jexcel_content", "jexcel_contextmenu", "jexcel_corner", "jexcel_dropdown", "jexcel_filter", "jexcel_freezed", "jexcel_hidden_index", "jexcel_nested", "jexcel_overflow", "jexcel_page", "jexcel_page_selected", "jexcel_pagination", "jexcel_pagination_dropdown", "jexcel_richtext", "jexcel_row", "jexcel_search", "jexcel_selectall", "jexcel_tab", "jexcel_tab_link", "jexcel_table", "jexcel_tabs", "jexcel_textarea", "jexcel_toolbar", "jexcel_toolbar_item", "material-icons", "readonly", "red", "resizable", "resizing", "selected", "selection", "selection-bottom", "selection-left", "selection-right", "selection-top", "styleBold", "with-toolbar"];
export type JexcelCssClass = typeof JEXCEL_CSS_CLASSES[number];
