import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Clear Formatting
 *
 * Adds a single button that resets all inline CSS styles from the selected cells.
 */
export declare class ClearFormattingPlugin implements JxToolbarPlugin {
    readonly id = "jx-clear-formatting";
    readonly label = "Cancella formattazione";
    private wb;
    init(ctx: JxToolbarPluginContext): void;
    destroy(): void;
    readonly items: JxToolbarItem[];
}
