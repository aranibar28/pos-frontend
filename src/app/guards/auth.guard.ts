import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isValidateToken().pipe(
      tap((res) => {
        if (!res) {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/auth');
          return false;
        }
        return true;
      })
    );
  }
}
