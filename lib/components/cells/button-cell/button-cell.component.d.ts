import { EventEmitter } from "@angular/core";
import { JxCellComponent } from "../../../models/jx-cell-component.interface";
import { JxCellContext } from "../../../models/jx-cell-context.model";
import * as i0 from "@angular/core";
/**
 * Custom cell that renders a clickable button inside the grid cell.
 *
 * The button label is derived from `context.config.label` (if set) or falls
 * back to the raw cell `value`.  When clicked it emits an `action` event
 * whose type and payload are also driven by `context.config`.
 *
 * @example
 * // Column definition
 * {
 *   title: 'Actions',
 *   name: 'actions',
 *   editor: {
 *     component: ButtonCellComponent,
 *   },
 *   options: { label: 'Apri', action: 'openDetail', payload: { mode: 'view' } },
 * }
 *
 * // Handling the action in the parent
 * onCellAction(event: { action: string; payload: any }): void {
 *   if (event.action === 'openDetail') {
 *     this.openRow(event.payload);
 *   }
 * }
 */
export declare class ButtonCellComponent implements JxCellComponent {
    /** Grid cell context injected by `JxTableComponent`. */
    context: JxCellContext;
    /**
     * Emits when the button is clicked.
     * Shape: `{ action: string; payload: any }` — values come from `context.config`.
     */
    action: EventEmitter<any>;
    /**
     * Visible button text.  Resolved from `context.config.label` first;
     * falls back to the string representation of the cell value, or `'Apri'`.
     */
    get label(): string;
    /**
     * Handles the button click: stops propagation to prevent cell selection
     * and emits the configured action.
     *
     * @param event - The originating `MouseEvent`.
     */
    click(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ButtonCellComponent, "jx-button-cell", never, { "context": { "alias": "context"; "required": false; }; }, { "action": "action"; }, never, never, false, never>;
}
