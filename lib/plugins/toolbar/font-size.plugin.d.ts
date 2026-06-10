import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Font Size
 *
 * Adds a `<select>` dropdown with pixel sizes.
 * Applies `font-size` CSS style to all selected cells.
 */
export declare class FontSizePlugin implements JxToolbarPlugin {
    private readonly sizes;
    readonly id = "jx-font-size";
    readonly label = "Font Size";
    private wb;
    constructor(sizes?: string[]);
    init(ctx: JxToolbarPluginContext): void;
    destroy(): void;
    get items(): JxToolbarItem[];
    private _apply;
}
