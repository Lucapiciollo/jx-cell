import * as i0 from "@angular/core";
/**
 * Attribute directive that adds the `jx-cell-editable` CSS class to the host
 * element when the bound value is `true`.
 *
 * Use this directive on any element that should visually respond to the
 * editable state of a grid cell (e.g. a wrapper `<div>` or a custom
 * cell component root).
 *
 * @example
 * <!-- Adds 'jx-cell-editable' when the cell is in edit mode -->
 * <div [jxCellEditable]="context.editable">{{ value }}</div>
 */
export declare class JxCellEditableDirective {
    /**
     * When `true`, the `jx-cell-editable` CSS class is applied to the host.
     * Typically bound to `context.editable` from a custom cell component.
     */
    editable: boolean;
    /**
     * Conditionally applies the `jx-cell-editable` class to the host element.
     * Driven by the `editable` input.
     */
    get isEditable(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCellEditableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<JxCellEditableDirective, "[jxCellEditable]", never, { "editable": { "alias": "jxCellEditable"; "required": false; }; }, {}, never, never, false, never>;
}
