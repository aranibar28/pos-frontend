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
import { Category, Product, Supplier } from 'src/app/utils/intefaces';

@Component({
  selector: 'app-forms-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-inventory.component.html',
})
export class FormsInventoryComponent {
  private dialogRef = inject(MatDialogRef<FormsInventoryComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    product: [, [Validators.required, RequireMatch]],
    supplier: [, [Validators.required, RequireMatch]],
    quantity: [, [Validators.required]],
  });

  public products: Category[] = [];
  public productsOptions: Category[] = [];
  public suppliers: Supplier[] = [];
  public suppliersOptions: Supplier[] = [];
  public loadButton: boolean = false;

  ngOnInit(): void {
    const { products, suppliers } = this.dialogData;
    this.products = products;
    this.suppliers = suppliers;
    this.productsOptions = products;
    this.suppliersOptions = suppliers;
    this.emitDataToFilter();
  }

  emitDataToFilter() {
    const product = this.myForm.controls['product'];
    const supplier = this.myForm.controls['supplier'];
    product.valueChanges.subscribe((value) => this.filterProduct(value));
    supplier.valueChanges.subscribe((value) => this.filterSupplier(value));
  }

  private filterProduct(value: string | null) {
    const transformValue = String(value).trim().toLowerCase();
    this.productsOptions = this.products.filter((item) =>
      item.title.toLowerCase().includes(transformValue)
    );
  }

  private filterSupplier(value: string | null) {
    const transformValue = String(value).trim().toLowerCase();
    this.suppliersOptions = this.suppliers.filter((item) =>
      item.name.toLowerCase().includes(transformValue)
    );
  }

  displayProduct(product: Product) {
    return product ? product.title : product;
  }

  displaySupplier(supplier: Supplier) {
    return supplier ? supplier.name : supplier;
  }

  onClick() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.loadButton = true;
    this.productService.create_inventory(this.myForm.value).subscribe({
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
