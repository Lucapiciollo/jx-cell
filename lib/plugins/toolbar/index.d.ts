/**
 * Built-in toolbar plugins for `jx-cell`.
 *
 * Each plugin implements `JxToolbarPlugin` and can be passed directly to
 * `options.toolbarPlugins`.  Instantiate them in your component and pass to
 * `buildOptions()`:
 *
 * ```ts
 * import {
 *   UndoRedoPlugin,
 *   FontFamilyPlugin,
 *   FontSizePlugin,
 *   BoldItalicUnderlinePlugin,
 *   AlignPlugin,
 *   ColorPlugin,
 *   ClearFormattingPlugin,
 *   WrapPlugin,
 *   JX_WORD_TOOLBAR_PLUGINS,
 * } from 'jx-cell';
 *
 * // Use the pre-composed "Word-like" set:
 * private readonly toolbarPlugins = JX_WORD_TOOLBAR_PLUGINS();
 *
 * // Or compose your own:
 * private readonly toolbarPlugins = [
 *   new UndoRedoPlugin(),
 *   new FontFamilyPlugin(),
 *   new BoldItalicUnderlinePlugin(),
 *   new AlignPlugin(),
 *   new ColorPlugin(),
 *   new ClearFormattingPlugin(),
 * ];
 * ```
 *
 * Then in `options`:
 * ```ts
 * {
 *   toolbar: true,   // show the toolbar bar
 *   toolbarPlugins: this.toolbarPlugins,
 * }
 * ```
 */
export * from './undo-redo.plugin';
export * from './font-family.plugin';
export * from './font-size.plugin';
export * from './bold-italic-underline.plugin';
export * from './align.plugin';
export * from './color.plugin';
export * from './clear-formatting.plugin';
export * from './wrap.plugin';
import { JxToolbarPlugin } from '../../models/jx-cell.models';
/**
 * Returns a pre-composed array of plugins that recreate a Word-like toolbar:
 * Undo/Redo | Font Family | Font Size | B I U S | Align | Color | Wrap | Clear
 *
 * Pass the result directly to `options.toolbarPlugins`.
 *
 * Each call returns **new instances** so you can safely call this once per
 * component and store the result in a private field.
 */
export declare function JX_WORD_TOOLBAR_PLUGINS(options?: {
    fonts?: string[];
    sizes?: string[];
}): JxToolbarPlugin[];
