import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business.service';
import { AlertService } from 'src/app/common/alert.service';
import { FORMS_MODULES } from 'src/app/utils/modules';
import { getErrorMessage } from 'src/app/utils/validators';

@Component({
  selector: 'app-forms-business',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-business.component.html',
})
export class FormsBusinessComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<FormsBusinessComponent>);
  public dialogData = inject(MAT_DIALOG_DATA);

  private authService = inject(AuthService);
  private businessService = inject(BusinessService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    ruc: [, [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    title: [, [Validators.required]],
    district: [, [Validators.required]],
    province: [, [Validators.required]],
    address: [, [Validators.required]],
    email: [],
    phone: [],
  });

  public titleModal: string = 'Registrar Empresa';
  public titleButton: string = 'Registrar';
  public colorButton: string = 'primary';
  public loadButton: boolean = false;
  public id: string = '';

  ngOnInit(): void {
    const { data, new_data } = this.dialogData;
    if (!new_data) {
      this.titleModal = 'Actualizar Empresa';
      this.titleButton = 'Actualizar';
      this.colorButton = 'accent';
      this.myForm.patchValue(data);
      this.id = data._id;
    }

    this.myForm.controls['ruc'].valueChanges.subscribe((res) => {
      if (String(res).length == 11) {
        this.authService
          .consulta_ruc(this.myForm.controls['ruc'].value!)
          .subscribe((res) => {
            if (res.ruc) {
              this.myForm.patchValue({
                title: res.razonSocial,
                district: res.distrito,
                province: res.provincia,
                address: res.direccion,
              });
            } else {
              this.alertService.error('No se encontraron resultados');
              this.myForm.patchValue({
                title: '',
                district: '',
                province: '',
                address: '',
              });
            }
          });
      }
    });
  }

  create_data() {
    this.loadButton = true;
    this.businessService.create_business(this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;
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
    this.businessService.update_business(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;
        if (!res.data) {
          return this.alertService.error(res.msg);
        }
        this.dialogRef.close(res);
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

  onLoading(): boolean {
    return (this.myForm.pristine && this.myForm.valid) || this.loadButton;
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
