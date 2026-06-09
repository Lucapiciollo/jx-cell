import { Type } from "@angular/core";
import { JxCellComponent } from "../models/jx-cell-component.interface";
import * as i0 from "@angular/core";
/**
 * Per-grid registry that maps column type strings to Angular component classes.
 *
 * Use this service to register custom cell renderers dynamically at runtime
 * without having to pass them directly in the column definition.
 * The grid looks up the registry when rendering cells whose column type matches
 * a registered key.
 *
 * This service is provided per-component (not root), so each grid instance
 * has its own isolated registry.
 *
 * @example
 * // Register a custom renderer for the 'status' type
 * registry.register('status', StatusBadgeCellComponent);
 *
 * // Retrieve it later
 * const component = registry.get('status'); // StatusBadgeCellComponent | null
 */
export declare class JxCellRegistryService {
    private readonly registry;
    /**
     * Registers a component class for the given cell type string.
     * If a component is already registered for that type it will be overwritten.
     *
     * @param type      - Column type key, e.g. `'status'`, `'rating'`, `'progress'`.
     * @param component - Angular component class that implements `JxCellComponent`.
     *
     * @example
     * registry.register('progress', ProgressBarCellComponent);
     */
    register(type: string, component: Type<JxCellComponent>): void;
    /**
     * Returns the component class registered for `type`, or `null` if none.
     *
     * @param type - Column type key.
     * @returns The registered component class, or `null`.
     *
     * @example
     * const cls = registry.get('progress'); // ProgressBarCellComponent | null
     */
    get(type: string): Type<JxCellComponent> | null;
    /**
     * Returns `true` when a component is registered for the given type.
     *
     * @param type - Column type key.
     *
     * @example
     * registry.has('progress'); // true
     */
    has(type: string): boolean;
    /**
     * Removes all registered component mappings.
     * Useful for testing or when re-initialising the grid.
     *
     * @example
     * registry.clear();
     */
    clear(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCellRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JxCellRegistryService>;
}
