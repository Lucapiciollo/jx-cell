import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JxIconOverrides } from '../tokens/jx-cell-icons.tokens';
import * as i0 from "@angular/core";
/**
 * Resolves icon markup for `jx-cell` components.
 *
 * Lookup order for a given `component` / `key` pair:
 * 1. the value provided through the {@link JX_ICONS} injection token, if any;
 * 2. otherwise the built-in default ({@link JX_DEFAULT_ICONS}).
 *
 * Resolved markup is returned as `SafeHtml` ready for `[innerHTML]` binding so
 * glyphs, HTML and inline SVG icons all render. Values are developer-provided
 * (trusted) so they are rendered without sanitisation; results are memoised to
 * avoid creating a new `SafeHtml` object on every change-detection cycle.
 */
export declare class JxIconService {
    private readonly sanitizer;
    private readonly overrides;
    private readonly cache;
    constructor(sanitizer: DomSanitizer, overrides: JxIconOverrides | null);
    /**
     * Returns the raw icon string for a component / key, applying the
     * override → default fallback. An override that is `null`, `undefined` or an
     * empty / whitespace-only string is treated as "not provided" and falls back
     * to the built-in default. Returns an empty string when neither exists.
     */
    getRaw(component: string, key: string): string;
    /**
     * Returns the icon for a component / key as `SafeHtml`, ready to bind with
     * `[innerHTML]`. Suitable for glyphs, icon-font markup, inline SVG and
     * asset URLs (`url:path/to/icon.svg` → rendered as `<img src="...">`).
     */
    get(component: string, key: string): SafeHtml;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxIconService, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JxIconService>;
}
