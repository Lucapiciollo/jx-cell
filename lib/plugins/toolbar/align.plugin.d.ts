import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Text Alignment
 *
 * Adds Left / Center / Right / Justify alignment buttons.
 * Applies `text-align` CSS style to all selected cells.
 */
export declare class AlignPlugin implements JxToolbarPlugin {
    readonly id = "jx-align";
    readonly label = "Allineamento testo";
    private wb;
    init(ctx: JxToolbarPluginContext): void;
    destroy(): void;
    readonly items: JxToolbarItem[];
}
