import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Bold / Italic / Underline / Strikethrough
 *
 * Each button toggles the respective CSS style on the selected cells.
 * The plugin tracks per-cell state by reading the current style before toggling.
 */
export declare class BoldItalicUnderlinePlugin implements JxToolbarPlugin {
    readonly id = "jx-biu";
    readonly label = "Bold / Italic / Underline";
    private wb;
    init(ctx: JxToolbarPluginContext): void;
    destroy(): void;
    readonly items: JxToolbarItem[];
    /**
     * Toggles a CSS property on the current selection.
     * If ALL selected cells already have `onValue`, sets them to `offValue`.
     * Otherwise sets all to `onValue`.
     */
    private _toggle;
}
