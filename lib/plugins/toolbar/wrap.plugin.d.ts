import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Word Wrap
 *
 * Adds a toggle button that enables / disables `white-space: pre-wrap`
 * on the selected cells (word-wrap).
 */
export declare class WrapPlugin implements JxToolbarPlugin {
    readonly id = "jx-wrap";
    readonly label = "A capo automatico";
    private wb;
    init(ctx: JxToolbarPluginContext): void;
    destroy(): void;
    readonly items: JxToolbarItem[];
}
