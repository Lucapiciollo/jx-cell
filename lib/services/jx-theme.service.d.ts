import * as i0 from "@angular/core";
/**
 * Un tema è un set di CSS custom properties `--jx-*` da applicare
 * su un elemento target (di default `document.documentElement` = `:root`).
 */
export interface JxTheme {
    /** Identificatore univoco del tema. */
    name: string;
    /** Etichetta human-readable. */
    label: string;
    /** Mappa `{ '--jx-property': 'valore' }`. */
    tokens: Record<string, string>;
}
/**
 * Servizio singleton per la gestione dei temi CSS della griglia.
 *
 * Applica / rimuove CSS custom properties `--jx-*` su un elemento DOM,
 * in modo che tutte le istanze di `jx-table` / `jx-grid` all'interno
 * di quell'elemento ereditino il tema scelto.
 *
 * **Utilizzo rapido:**
 * ```ts
 * const themeService = inject(JxThemeService);
 * themeService.apply(MY_THEME);           // applica su :root
 * themeService.reset();                   // torna al tema di default
 * themeService.toggle(THEME_A, THEME_B); // alterna tra due temi
 * ```
 */
export declare class JxThemeService {
    private readonly _active;
    /** Signal (read-only) con il nome del tema attivo. */
    readonly activeTheme: import("@angular/core").Signal<string>;
    /**
     * Applica un tema CSS sull'elemento target (default: `:root`).
     * Le proprietà del tema precedente non vengono rimosse: usa {@link reset}
     * prima di applicarne uno nuovo se vuoi uno switch pulito.
     */
    apply(theme: JxTheme, target?: HTMLElement): void;
    /**
     * Rimuove tutte le sovrascritture `--jx-*` dall'elemento target,
     * tornando ai valori di default definiti dalla libreria.
     */
    reset(target?: HTMLElement): void;
    /**
     * Alterna tra due temi: se il tema corrente è `a`, applica `b`, altrimenti `a`.
     * Utile per un semplice pulsante toggle.
     */
    toggle(a: JxTheme, b: JxTheme, target?: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxThemeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JxThemeService>;
}
