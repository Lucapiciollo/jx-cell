import { EventEmitter } from "@angular/core";
import { JxCellComponent } from "../../../models/jx-cell-component.interface";
import { JxCellContext } from "../../../models/jx-cell-context.model";
import * as i0 from "@angular/core";
/**
 * Custom cell that displays an attachment count badge and opens an attachment
 * panel when clicked.
 *
 * Register this component as a custom cell type to show a clickable badge like
 * `"3 allegati"` in any grid column whose value is an array of attachment objects.
 *
 * @example
 * // Column definition
 * {
 *   title: 'Allegati',
 *   name: 'attachments',
 *   editor: { component: AttachmentCellComponent },
 * }
 *
 * // Handling the emitted action in the parent
 * onCellAction(event: { action: string; payload: any }): void {
 *   if (event.action === 'openAttachments') {
 *     this.openAttachmentDialog(event.payload.attachments, event.payload.row);
 *   }
 * }
 */
export declare class AttachmentCellComponent implements JxCellComponent {
    /** Grid cell context injected by `JxTableComponent`. */
    context: JxCellContext;
    /**
     * Emits when the user clicks the attachment badge.
     * Payload shape: `{ action: 'openAttachments', payload: { row, attachments } }`.
     */
    action: EventEmitter<any>;
    /**
     * Number of attachments in the cell's value array.
     * Returns `0` when the value is not an array.
     */
    get count(): number;
    /**
     * Handles the click on the attachment badge, stops event propagation
     * to avoid triggering cell-selection logic, and emits the `action` output.
     *
     * @param event - The originating `MouseEvent`.
     */
    openAttachments(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AttachmentCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AttachmentCellComponent, "jx-attachment-cell", never, { "context": { "alias": "context"; "required": false; }; }, { "action": "action"; }, never, never, false, never>;
}
