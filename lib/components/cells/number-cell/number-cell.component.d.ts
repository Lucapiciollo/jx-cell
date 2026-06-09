import { EventEmitter } from "@angular/core";
import { JxCellComponent } from "../../../models/jx-cell-component.interface";
import { JxCellContext } from "../../../models/jx-cell-context.model";
import * as i0 from "@angular/core";
/**
 * Editable numeric cell that renders a read-only display by default and
 * switches to a `<input type="number">` when the user activates editing.
 *
 * The component manages its own `editing` / `editValue` state so the parent
 * grid does not need to track focus for this cell type.  When the user
 * commits the edit (blur / Enter) the new value is emitted via `valueChange`.
 * Pressing Escape calls `cancel()` and discards the change.
 *
 * @example
 * // Column definition
 * {
 *   title: 'Qty',
 *   name: 'qty',
 *   type: 'numeric',
 *   editor: { component: NumberCellComponent },
 * }
 */
export declare class NumberCellComponent implements JxCellComponent {
    /** Grid cell context injected by `JxSpreadsheetComponent`. */
    context: JxCellContext;
    /**
     * Emits the committed numeric value when the user saves the edit.
     * The payload is `number | null`.
     */
    valueChange: EventEmitter<any>;
    /** Whether the cell is currently in edit mode (showing the number input). */
    editing: boolean;
    /** Mutable copy of the value while the user is editing. `null` for empty. */
    editValue: number | null;
    /**
     * Puts the cell into edit mode by setting `editing = true` and copying the
     * current value into `editValue`.  Silently exits when the cell is read-only.
     */
    startEdit(): void;
    /**
     * Commits the current `editValue` and exits edit mode.
     * Emits `valueChange` with the new number (or `null` for empty).
     * Does nothing if the cell is not currently editing.
     */
    commit(): void;
    /**
     * Cancels the current edit without emitting a value change.
     * Restores the display view (`editing = false`).
     */
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NumberCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NumberCellComponent, "jx-number-cell", never, { "context": { "alias": "context"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, false, never>;
}
