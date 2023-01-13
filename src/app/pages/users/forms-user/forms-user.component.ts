import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/common/alert.service';
import { getErrorMessage } from 'src/app/utils/validators';

import { FORMS_MODULES } from 'src/app/utils/modules';

@Component({
  selector: 'app-forms-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-user.component.html',
})
export class FormsUserComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<FormsUserComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    email: [, [Validators.required, , Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
    dni: [, [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    first_name: [, [Validators.required]],
    last_name: [, [Validators.required]],
    status: [false],
  });

  public titleModal: string = 'Registrar Usuario';
  public titleButton: string = 'Registrar';
  public colorButton: string = 'primary';
  public loadSearch: boolean = false;
  public loadButton: boolean = false;
  public hide: boolean = true;

  public logged: string = this.authService.id;
  public id: string = '';
  public user: any = {};

  ngOnInit(): void {
    this.getSunatData();
    const { data, new_data } = this.dialogData;
    if (!new_data) {
      this.titleModal = 'Actualizar Usuario';
      this.titleButton = 'Actualizar';
      this.colorButton = 'accent';
      this.myForm.patchValue(data);
      this.id = data._id;
      this.myForm.controls['password'].value;
    }
  }

  getSunatData() {
    const dni = this.myForm.controls['dni'];
    dni.valueChanges.subscribe((res) => {
      if (String(res).length == 8) {
        this.authService.consulta_id(res, 'dni').subscribe((res) => {
          if (res.dni) {
            const first_name = res.nombres;
            const last_name = res.apellidoPaterno + ' ' + res.apellidoMaterno;
            this.myForm.patchValue({ first_name, last_name });
          } else {
            this.alertService.error('No se encontraron resultados');
            this.myForm.patchValue({ first_name: '', last_name: '' });
          }
        });
      }
    });
  }

  create_data() {
    this.loadButton = true;
    this.userService.create_user(this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;

        if (res.exist) {
          this.myForm.controls['email'].reset();
          this.myForm.controls['email'].markAsTouched();
          return this.alertService.error(res.msg);
        }

        if (!res.data) {
          return this.alertService.error(res.msg);
        }

        this.dialogRef.close(true);
        this.alertService.success('Se registró correctamente');
      },
      error: (err) => {
        this.loadButton = false;
        console.log(err);
      },
    });
  }

  update_data() {
    this.loadButton = true;

    this.userService.update_user(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;

        if (res.exist) {
          this.myForm.controls['email'].reset();
          this.myForm.controls['email'].markAsTouched();
          return this.alertService.error(res.msg);
        }

        if (!res.data) {
          return this.alertService.error(res.msg);
        }

        if (this.id == this.logged) {
          this.authService.emitter({
            value: res.data.full_name,
          });
        }

        this.dialogRef.close(true);
        this.alertService.success('Se actualizó correctamente');
      },
      error: (err) => {
        this.loadButton = false;
        console.log(err);
      },
    });
  }

  onClick() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.id) {
      this.update_data();
    } else {
      this.create_data();
    }
  }

  onClose() {
    this.dialogRef.close(false);
  }

  public message: { [key: string]: string } = {};
  showError(name: string) {
    const input = this.myForm.controls[name];
    if (input.errors && input.touched) {
      return (this.message[name] = getErrorMessage(name, this.myForm));
    } else {
      return (this.message[name] = '');
    }
  }
}
