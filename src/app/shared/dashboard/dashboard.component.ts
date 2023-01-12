import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DASHBOARD_MODULES, TRANSLATE_PAGINATOR } from 'src/app/utils/modules';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { sidebar } from 'src/app/utils/sidebar';

import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DASHBOARD_MODULES],
  providers: [TRANSLATE_PAGINATOR],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  public isDarkTheme = localStorage.getItem('theme') === 'dark' ? true : false;
  public sidebar = sidebar;

  public user = this.authService.payload;
  public allows = this.authService.allows;
  public loading!: BehaviorSubject<boolean>;

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit() {
    this.loading = this.authService.isLoading;
    this.authService.courier.subscribe((res) => {
      this.user.full_name = res.value;
    });
    this.authService.courierAllow.subscribe((res) => {
      this.allows = res.value;
    });
  }

  isExpanded(children: any[]): boolean {
    return children.some((child) =>
      this.router.url.endsWith('/dashboard/' + child.path)
    );
  }

  isAllowed(module: any) {
    return this.allows[module];
  }

  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'ligth');
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Estas seguro de salir?`,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigateByUrl('/login');
        localStorage.removeItem('token');
      }
    });
  }
}
