import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditSupplierComponent } from './add-edit-supplier/add-edit-supplier.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierComponent } from './supplier.component';

const routes: Routes = [{
  path: '',
  component: SupplierComponent,
  children: [
    {
      path: '',
      component: SupplierListComponent,
    },
    {
      path: 'list',
      component: SupplierListComponent,
    },
    {
      path: 'add',
      component: AddEditSupplierComponent,
    },
    {
      path: 'edit/:id',
      component: AddEditSupplierComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierRoutingModule {
}
