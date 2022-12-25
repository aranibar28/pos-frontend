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
      { path: 'users', loadChildren: () => import('./pages/routes').then((routes) => routes.User) },
      { path: 'suppliers', loadChildren: () => import('./pages/routes').then((routes) => routes.Supplier) },
      { path: 'categories', loadChildren: () => import('./pages/routes').then((routes) => routes.Category) },
      { path: 'products', loadChildren: () => import('./pages/routes').then((routes) => routes.Product) },
      { path: 'purchases', loadChildren: () => import('./pages/routes').then((routes) => routes.Purchase) },
      { path: 'sales', loadChildren: () => import('./pages/routes').then((routes) => routes.Sales) },
      { path: 'roles', loadChildren: () => import('./pages/routes').then((routes) => routes.Roles) },
      { path: 'forbidden', component: ForbiddenComponent },
      { path: '**', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
