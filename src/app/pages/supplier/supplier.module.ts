import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { ThemeModule } from './../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { AddEditSupplierComponent } from './add-edit-supplier/add-edit-supplier.component';



@NgModule({
  declarations: [SupplierComponent,SupplierListComponent,AddEditSupplierComponent],
  imports: [
    CommonModule,
    ThemeModule,
    SupplierRoutingModule
  ]
})
export class SupplierModule { }
