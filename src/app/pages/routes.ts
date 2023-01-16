import { Routes } from '@angular/router';
import { AllowedGuard } from '../guards/allowed.guard';

import { IndexComponent } from './account/index/index.component';
import { ConfigComponent } from './account/config/config.component';

import { IndexRoleComponent } from './roles/index-role/index-role.component';
import { IndexUserComponent } from './users/index-user/index-user.component';
import { IndexCategoryComponent } from './categories/index-category/index-category.component';
import { IndexProductComponent } from './products/index-product/index-product.component';
import { IndexSupplierComponent } from './suppliers/index-supplier/index-supplier.component';

import { IndexInventoryComponent } from './inventories/index-inventory/index-inventory.component';
import { OutputInventoryComponent } from './inventories/output-inventory/output-inventory.component';
import { IndexSaleComponent } from './sales/index-sale/index-sale.component';
import { FormsSaleComponent } from './sales/forms-sale/forms-sale.component';

export const Index: Routes = [
  { path: '', component: IndexComponent, title: 'Dashboard' },
  { path: '**', redirectTo: '' },
];

export const Config: Routes = [
  { path: '', component: ConfigComponent, canActivate: [AllowedGuard], title: 'Config', data: { module: 'system' } },
  { path: '**', redirectTo: '' },
];

export const Role: Routes = [
  { path: '', component: IndexRoleComponent, canActivate: [AllowedGuard], title: 'Roles', data: { module: 'system' } },
  { path: '**', redirectTo: '' },
];

export const User: Routes = [
  { path: '', component: IndexUserComponent, canActivate: [AllowedGuard], title: 'Usuarios', data: { module: 'users' } },
  { path: '**', redirectTo: '' },
];

export const Supplier: Routes = [
  { path: '', component: IndexSupplierComponent, canActivate: [AllowedGuard], title: 'Proveedores', data: { module: 'suppliers' } },
  { path: '**', redirectTo: '' },
];

export const Category: Routes = [
  { path: '', component: IndexCategoryComponent, canActivate: [AllowedGuard], title: 'Categorías', data: { module: 'categories' } },
  { path: '**', redirectTo: '' },
];

export const Product: Routes = [
  { path: '', component: IndexProductComponent, canActivate: [AllowedGuard], title: 'Productos', data: { module: 'products' } },
  { path: '**', redirectTo: '' },
];

export const Inventory: Routes = [
  { path: '', component: IndexInventoryComponent, canActivate: [AllowedGuard], title: 'Inventarios', data: { module: 'inventories' } },
  { path: 'output', component: OutputInventoryComponent, canActivate: [AllowedGuard], title: 'Inventarios', data: { module: 'inventories' } },
  { path: '**', redirectTo: '' },
];

export const Sales: Routes = [
  { path: '', component: IndexSaleComponent, canActivate: [AllowedGuard], title: 'Ventas', data: { module: 'sales' } },
  { path: 'create', component: FormsSaleComponent, canActivate: [AllowedGuard], title: 'Ventas', data: { module: 'sales' } },
  { path: '**', redirectTo: '' },
];

