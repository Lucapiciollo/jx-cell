import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Undo / Redo
 *
 * Adds two icon buttons — undo and redo — that call the workbook history API.
 */
export declare class UndoRedoPlugin implements JxToolbarPlugin {
    readonly id = "jx-undo-redo";
    readonly label = "Undo / Redo";
    private wb;
    init(ctx: JxToolbarPluginContext): void;
    destroy(): void;
    readonly items: JxToolbarItem[];
}
