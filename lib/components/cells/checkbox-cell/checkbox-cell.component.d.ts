import { EventEmitter } from "@angular/core";
import { JxCellComponent } from "../../../models/jx-cell-component.interface";
import { JxCellContext } from "../../../models/jx-cell-context.model";
import * as i0 from "@angular/core";
/**
 * Custom cell that renders a boolean toggle (checkbox) inside the grid cell.
 *
 * The component respects the `context.editable` flag — toggling is silently
 * ignored when the cell is read-only.
 *
 * @example
 * // Column definition
 * {
 *   title: 'Attivo',
 *   name: 'active',
 *   type: 'checkbox',
 *   editor: { component: CheckboxCellComponent },
 * }
 *
 * // In the template
 * // <jx-checkbox-cell [context]="ctx" (valueChange)="onToggle($event)"></jx-checkbox-cell>
 */
export declare class CheckboxCellComponent implements JxCellComponent {
    /** Grid cell context injected by `JxTableComponent`. */
    context: JxCellContext;
    /**
     * Emits the new boolean value when the user toggles the checkbox.
     * Not emitted when `context.editable` is `false`.
     */
    valueChange: EventEmitter<any>;
    /**
     * Handles a toggle event from the template.
     * Does nothing when the cell is not editable.
     *
     * @param value - The new boolean state of the checkbox.
     */
    toggle(value: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CheckboxCellComponent, "jx-checkbox-cell", never, { "context": { "alias": "context"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, false, never>;
}
