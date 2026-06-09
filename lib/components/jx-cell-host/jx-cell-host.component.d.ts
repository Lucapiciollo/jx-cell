import { EventEmitter, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef } from "@angular/core";
import { JxCellContext } from "../../models/jx-cell-context.model";
import { JxCellRegistryService } from "../../services/jx-cell-registry.service";
import * as i0 from "@angular/core";
export declare class JxCellHostComponent implements OnChanges, OnDestroy {
    private registry;
    context: JxCellContext;
    valueChange: EventEmitter<any>;
    action: EventEmitter<any>;
    container: ViewContainerRef;
    private componentRef?;
    private subscriptions;
    constructor(registry: JxCellRegistryService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private render;
    private resolveComponent;
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCellHostComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JxCellHostComponent, "jx-cell-host", never, { "context": { "alias": "context"; "required": false; }; }, { "valueChange": "valueChange"; "action": "action"; }, never, never, false, never>;
}
