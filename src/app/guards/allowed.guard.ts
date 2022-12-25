import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AllowedGuard implements CanActivate {
  public allows = this.authService.allows;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    // console.log(route.routeConfig?.title);
    const module = route.data['module'];
    if (!this.allows[module]) {
      this.router.navigateByUrl('/dashboard/forbidden');
      return false;
    }
    return true;
  }
}
