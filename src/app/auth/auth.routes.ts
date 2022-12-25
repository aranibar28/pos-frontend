import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignedInGuard } from '../guards/signed.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [SignedInGuard] },
];
