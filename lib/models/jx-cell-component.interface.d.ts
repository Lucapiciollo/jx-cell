import { EventEmitter } from "@angular/core";
import { JxCellContext } from "./jx-cell-context.model";
export interface JxCellComponent<T = any> {
    context: JxCellContext<T>;
    valueChange?: EventEmitter<any>;
    action?: EventEmitter<any>;
}
