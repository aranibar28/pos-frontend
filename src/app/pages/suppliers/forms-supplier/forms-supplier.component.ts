import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SupplierService } from 'src/app/services/supplier.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/common/alert.service';
import { getErrorMessage } from 'src/app/utils/validators';
import { FORMS_MODULES } from 'src/app/utils/modules';

@Component({
  selector: 'app-forms-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-supplier.component.html',
})
export class FormsSupplierComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<FormsSupplierComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  private supplierService = inject(SupplierService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    ruc: [, [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    name: [, Validators.required],
    address: [, [Validators.required]],
    phone: [, Validators.required],
  });

  public titleModal: string = 'Registrar Proveedor';
  public titleButton: string = 'Registrar';
  public colorButton: string = 'primary';
  public loadButton: boolean = false;
  public loadSearch: boolean = false;

  public categories: Array<any> = [];
  public categoriesOptions: Array<any> = [];
  public id: string = '';

  ngOnInit(): void {
    const { data, categories, new_data } = this.dialogData;
    this.categories = categories;
    this.categoriesOptions = categories;
    if (!new_data) {
      this.titleModal = 'Actualizar Proveedor';
      this.titleButton = 'Actualizar';
      this.colorButton = 'accent';
      this.myForm.patchValue(data);
      this.id = data._id;
    }
  }

  create_data() {
    this.loadButton = true;
    this.supplierService.create_supplier(this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;

        if (res.exist) {
          this.myForm.controls['ruc'].reset();
          this.myForm.controls['ruc'].markAsTouched();
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
    this.supplierService.update_supplier(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;

        if (res.exist) {
          this.myForm.controls['ruc'].reset();
          this.myForm.controls['ruc'].markAsTouched();
          return this.alertService.error(res.msg);
        }

        if (!res.data) {
          return this.alertService.error(res.msg);
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

  onSearchDni() {
    this.loadSearch = true;
    const ruc = this.myForm.controls['ruc'];

    if (ruc.invalid) {
      ruc.markAsTouched();
      this.loadSearch = false;
      return;
    }

    this.authService.consulta_ruc(ruc.value, 'ruc').subscribe({
      next: (res) => {
        this.loadSearch = false;
        if (res.ruc) {
          this.myForm.patchValue({
            name: res.razonSocial,
            address: res.direccion,
          });
        } else {
          this.alertService.error('No se encontraron resultados');
          this.myForm.patchValue({ name: '', address: '' });
        }
      },
      error: (err) => {
        this.loadSearch = false;
        this.alertService.success('Ocurrió un error con la búsqueda.');
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

  onlyNumber(event: KeyboardEvent) {
    const regex = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(event.key) || inputElement.value.length >= 11) {
      event.preventDefault();
    }
  }

  isValid(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }

  showMessage(name: string) {
    return getErrorMessage(name, this.myForm);
  }
}
