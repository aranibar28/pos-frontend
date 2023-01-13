import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryService } from 'src/app/services/category.service';
import { AlertService } from 'src/app/common/alert.service';
import { getErrorMessage } from 'src/app/utils/validators';
import { FORMS_MODULES } from 'src/app/utils/modules';

@Component({
  selector: 'app-forms-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-category.component.html',
})
export class FormsCategoryComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<FormsCategoryComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    title: [, [Validators.required, Validators.minLength(3)]],
    description: [, Validators.required],
    status: [false],
  });

  public titleModal: string = 'Registrar Categoría';
  public titleButton: string = 'Registrar';
  public colorButton: string = 'primary';
  public loadButton: boolean = false;
  public id: string = '';

  ngOnInit(): void {
    const { data, new_data } = this.dialogData;
    if (!new_data) {
      this.titleModal = 'Actualizar Categoría';
      this.titleButton = 'Actualizar';
      this.colorButton = 'accent';
      this.myForm.patchValue(data);
      this.id = data._id;
    }
  }

  create_data() {
    this.loadButton = true;
    this.categoryService.create_category(this.myForm.value).subscribe({
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
    this.categoryService.update_category(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;
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
