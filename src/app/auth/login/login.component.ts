import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/common/alert.service';
import { SHARED_MODULES } from 'src/app/utils/modules';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_MODULES, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public load_btn: boolean = false;
  public loading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    email: ['admin@gmail.com', [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
  });

  login() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    this.load_btn = true;
    this.authService.login_user(this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (!res.data) {
          return this.alertService.error(res.msg);
        }
        this.router.navigateByUrl('/dashboard');
        this.alertService.success('Bienvenido usuario');
        localStorage.setItem('token', res.token);
      },
      error: (err) => {
        console.log(err);
        this.load_btn = false;
      },
    });
  }
}
