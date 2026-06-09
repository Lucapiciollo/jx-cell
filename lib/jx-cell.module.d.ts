import { JxCellRegistryService } from './services/jx-cell-registry.service';
import * as i0 from "@angular/core";
import * as i1 from "./components/jx-table/jx-table.component";
import * as i2 from "./components/jx-grid/jx-grid.component";
import * as i3 from "./components/jx-cell-host/jx-cell-host.component";
import * as i4 from "./directives/jx-cell-editable.directive";
import * as i5 from "./components/cells/text-cell/text-cell.component";
import * as i6 from "./components/cells/number-cell/number-cell.component";
import * as i7 from "./components/cells/checkbox-cell/checkbox-cell.component";
import * as i8 from "./components/cells/formula-cell/formula-cell.component";
import * as i9 from "./components/cells/button-cell/button-cell.component";
import * as i10 from "./components/cells/attachment-cell/attachment-cell.component";
import * as i11 from "@angular/common";
import * as i12 from "@angular/forms";
import * as i13 from "ux-directives";
/**
 * Angular NgModule that provides the `jx-cell` library.
 *
 * Import `JxCellModule` once in your application's `AppModule` (or any feature
 * module where the grid is used) to make the `<jx-table>` and `<jx-grid>`
 * components available.
 *
 * **Peer services** (`JxAddressService`, `JxFormulaService`) are provided in the
 * Angular root injector (`providedIn: 'root'`), so they do **not** need to be
 * listed in `providers`.
 *
 * **Per-instance service** (`JxWorkbookService`) is provided via the component's
 * own `providers` array — each `<jx-table>` element gets its own isolated
 * workbook instance automatically.
 *
 * @example
 * // app.module.ts
 * import { JxCellModule } from 'jx-cell';
 *
 * @NgModule({
 *   imports: [BrowserModule, JxCellModule],
 * })
 * export class AppModule {}
 *
 * // any template
 * // <jx-table [options]="gridOptions" (ready)="onReady($event)"></jx-table>
 * // <jx-grid [data]="rows" [columns]="columns" [options]="opts"></jx-grid>
 */
export declare class JxCellModule {
    constructor(registry: JxCellRegistryService);
    static ɵfac: i0.ɵɵFactoryDeclaration<JxCellModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JxCellModule, [typeof i1.JxTableComponent, typeof i2.JxGridComponent, typeof i3.JxCellHostComponent, typeof i4.JxCellEditableDirective, typeof i5.TextCellComponent, typeof i6.NumberCellComponent, typeof i7.CheckboxCellComponent, typeof i8.FormulaCellComponent, typeof i9.ButtonCellComponent, typeof i10.AttachmentCellComponent], [typeof i11.CommonModule, typeof i12.FormsModule, typeof i13.UxDirectivesModule], [typeof i1.JxTableComponent, typeof i2.JxGridComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JxCellModule>;
}
