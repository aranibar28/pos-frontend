import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/common/alert.service';
import { RequireMatch } from 'src/app/utils/require-match';
import { getErrorMessage } from 'src/app/utils/validators';
import { FORMS_MODULES } from 'src/app/utils/modules';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-forms-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-product.component.html',
})
export class FormsProductComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<FormsProductComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    title: [, [Validators.required, Validators.minLength(3)]],
    description: [, Validators.required],
    category: [, [Validators.required, RequireMatch]],
    price: [, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
    status: [false],
  });

  public titleModal: string = 'Registrar Producto';
  public titleButton: string = 'Registrar';
  public colorButton: string = 'primary';
  public loadButton: boolean = false;
  public categories: Category[] = [];
  public categoriesOptions: Category[] = [];
  public id: string = '';

  ngOnInit(): void {
    const { data, categories, new_data } = this.dialogData;
    this.categories = categories;
    this.categoriesOptions = categories;
    if (!new_data) {
      this.titleModal = 'Actualizar Producto';
      this.titleButton = 'Actualizar';
      this.colorButton = 'accent';
      this.myForm.patchValue(data);
      this.id = data._id;
    }
    this.emitDataToFilter();
  }

  emitDataToFilter() {
    this.myForm.controls['category'].valueChanges.subscribe((data) => {
      this.filterData(data);
    });
  }

  filterData(data: string) {
    const value = data.toString().toLowerCase();
    this.categoriesOptions = this.categories.filter((item) => {
      return item?.title.toLowerCase().indexOf(value) > -1;
    });
  }

  displayFn(category: Category) {
    return category ? category.title : category;
  }

  create_data() {
    this.loadButton = true;
    this.productService.create_product(this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;

        if (res.exist) {
          this.myForm.controls['title'].reset();
          this.myForm.controls['title'].markAsTouched();
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
    this.productService.update_product(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;

        if (res.exist) {
          this.myForm.controls['title'].reset();
          this.myForm.controls['title'].markAsTouched();
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

  isValid(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }

  showMessage(name: string) {
    return getErrorMessage(name, this.myForm);
  }
}
