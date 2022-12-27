import { Routes } from '@angular/router';
import { AllowedGuard } from '../guards/allowed.guard';

import { IndexRoleComponent } from './roles/index-role/index-role.component';
import { IndexUserComponent } from './users/index-user/index-user.component';
import { IndexCategoryComponent } from './categories/index-category/index-category.component';
import { IndexProductComponent } from './products/index-product/index-product.component';
import { IndexSupplierComponent } from './suppliers/index-supplier/index-supplier.component';
import { IndexPurchaseComponent } from './purchases/index-purchase/index-purchase.component';
import { IndexSaleComponent } from './sales/index-sale/index-sale.component';
import { ListPurchasesComponent } from './purchases/list-purchases/list-purchases.component';

export const User: Routes = [
  { path: '', component: IndexUserComponent, canActivate: [AllowedGuard], title: 'Usuarios', data: { module: 'users' } },
  { path: '**', redirectTo: '' },
];

export const Supplier: Routes = [
  { path: '', component: IndexSupplierComponent, canActivate: [AllowedGuard], title: 'Proveedores', data: { module: 'suppliers' } },
  { path: '**', redirectTo: '' },
];

export const Category: Routes = [
  { path: '', component: IndexCategoryComponent, canActivate: [AllowedGuard], title: 'Categoría', data: { module: 'categories' } },
  { path: '**', redirectTo: '' },
];

export const Product: Routes = [
  { path: '', component: IndexProductComponent, canActivate: [AllowedGuard], title: 'Producto', data: { module: 'products' } },
  { path: '**', redirectTo: '' },
];

export const Purchase: Routes = [
  { path: '', component: IndexPurchaseComponent, canActivate: [AllowedGuard], title: 'Compras', data: { module: 'purchases' } },
  { path: 'list', component: ListPurchasesComponent, canActivate: [AllowedGuard], title: 'Compras', data: { module: 'purchases' } },
  { path: '**', redirectTo: '' },
];

export const Sales: Routes = [
  { path: '', component: IndexSaleComponent, canActivate: [AllowedGuard], title: 'Ventas', data: { module: 'sales' } },
  { path: '**', redirectTo: '' },
];

export const Roles: Routes = [
  { path: '', component: IndexRoleComponent, title: 'Roles', data: { module: 'roles' } },
  { path: '**', redirectTo: '' },
];