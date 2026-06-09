import { EventEmitter } from "@angular/core";
import { JxCellComponent } from "../../../models/jx-cell-component.interface";
import { JxCellContext } from "../../../models/jx-cell-context.model";
import * as i0 from "@angular/core";
/**
 * Editable free-text cell that renders a read-only `<span>` by default and
 * switches to a `<input type="text">` when the user activates editing.
 *
 * The component manages its own `editing` / `editValue` state.  A value
 * change is only emitted when the committed value actually differs from the
 * original — no-op commits (pressing Enter without changing anything) are
 * silently dropped.  Pressing Escape calls `cancel()` and discards the change.
 *
 * @example
 * // Column definition
 * {
 *   title: 'Name',
 *   name: 'name',
 *   editor: { component: TextCellComponent },
 * }
 */
export declare class TextCellComponent implements JxCellComponent {
    /** Grid cell context injected by `JxSpreadsheetComponent`. */
    context: JxCellContext;
    /**
     * Emits the new string value when the user commits a change.
     * **Not** emitted when the value is unchanged.
     */
    valueChange: EventEmitter<any>;
    /** Whether the cell is currently in edit mode (showing the text input). */
    editing: boolean;
    /** Mutable copy of the value while the user is typing. */
    editValue: any;
    /**
     * Puts the cell into edit mode by copying `context.value` into `editValue`.
     * Silently exits when the cell is read-only.
     */
    startEdit(): void;
    /**
     * Commits `editValue` if it differs from the original value and exits edit mode.
     * Emits `valueChange` only when the value actually changed.
     * Does nothing if the cell is not currently editing.
     */
    commit(): void;
    /**
     * Cancels the current edit without emitting a value change.
     * Resets `editValue` to the original `context.value`.
     */
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextCellComponent, "jx-text-cell", never, { "context": { "alias": "context"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, false, never>;
}
