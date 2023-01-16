import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { PagesComponent } from './pages/pages.component';
import { ForbiddenComponent } from './shared/forbidden/forbidden.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'prefix' },
  { path: 'login', loadChildren: () => import('./auth/auth.routes').then(({ routes }) => routes) },
  { path: 'dashboard',
    canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      { path: 'forbidden', component: ForbiddenComponent },
      { path: 'users', loadChildren: () => import('./pages/routes').then((routes) => routes.User) },
      { path: 'suppliers', loadChildren: () => import('./pages/routes').then((routes) => routes.Supplier) },
      { path: 'categories', loadChildren: () => import('./pages/routes').then((routes) => routes.Category) },
      { path: 'products', loadChildren: () => import('./pages/routes').then((routes) => routes.Product) },
      { path: 'inventories', loadChildren: () => import('./pages/routes').then((routes) => routes.Inventory) },
      { path: 'sales', loadChildren: () => import('./pages/routes').then((routes) => routes.Sales) },
      { path: 'config', loadChildren: () => import('./pages/routes').then((routes) => routes.Config) },
      { path: 'roles', loadChildren: () => import('./pages/routes').then((routes) => routes.Role) },
      { path: 'index', loadChildren: () => import('./pages/routes').then((routes) => routes.Index) },
      { path: '**', redirectTo: 'index', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
