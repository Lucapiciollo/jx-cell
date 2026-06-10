import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Font Family
 *
 * Adds a `<select>` dropdown with a configurable list of font families.
 * Applies `font-family` CSS style to all selected cells.
 */
export declare class FontFamilyPlugin implements JxToolbarPlugin {
    private readonly fonts;
    readonly id = "jx-font-family";
    readonly label = "Font Family";
    private wb;
    constructor(fonts?: string[]);
    init(ctx: JxToolbarPluginContext): void;
    destroy(): void;
    get items(): JxToolbarItem[];
    private _apply;
}
