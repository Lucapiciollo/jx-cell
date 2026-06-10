import { JxToolbarItem, JxToolbarPlugin, JxToolbarPluginContext } from '../../models/jx-cell.models';
/**
 * Toolbar plugin: Text Color & Background Color
 *
 * Adds two color-picker buttons:
 * - `color` → applies `color` (text color)
 * - `background-color` → applies `background-color` (cell fill)
 */
export declare class ColorPlugin implements JxToolbarPlugin {
    readonly id = "jx-color";
    readonly label = "Colore testo / sfondo";
    init(_ctx: JxToolbarPluginContext): void;
    destroy(): void;
    readonly items: JxToolbarItem[];
}
