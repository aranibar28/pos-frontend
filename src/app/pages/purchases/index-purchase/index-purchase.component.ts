import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { AlertService } from 'src/app/common/alert.service';
import { FormsSupplierComponent } from '../../suppliers/forms-supplier/forms-supplier.component';
import { RequireMatch } from 'src/app/utils/require-match';
import { Supplier, Product } from 'src/app/utils/intefaces';

import {
  SHARED_MODULES,
  TABLE_MODULES,
  FORMS_MODULES,
} from 'src/app/utils/modules';

const columns = ['image', 'title', 'quantity', 'price', 'subtotal', 'actions'];

@Component({
  selector: 'app-index-purchase',
  standalone: true,
  imports: [SHARED_MODULES, FORMS_MODULES, TABLE_MODULES],
  templateUrl: './index-purchase.component.html',
})
export class IndexPurchaseComponent implements OnInit, AfterViewInit {
  private supplierService = inject(SupplierService);
  private purchaseService = inject(PurchaseService);
  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;
  public loadButton: boolean = false;
  public loadSearch: boolean = false;

  public suppliers: Supplier[] = [];
  public products: Product[] = [];
  public suppliersOptions: Supplier[] = [];
  public productsOptions: Product[] = [];
  public details = JSON.parse(localStorage.getItem('details') || '[]');

  public total: number = 0;
  public count: number = 0;

  public product = new FormControl('');
  public supplier = new FormControl('', [Validators.required, RequireMatch]);

  ngOnInit(): void {
    this.init_products();
    this.init_suppliers();
    this.calculate_total();
  }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.details);

    this.supplier.valueChanges.subscribe((data) => {
      const value = String(data).trim();
      this.filterSupplier(value);
    });

    this.product.valueChanges.subscribe((data) => {
      const value = String(data).trim();
      this.filterProduct(value);
    });
  }

  filterSupplier(data: string) {
    const value = data.toString().toLowerCase();
    this.suppliersOptions = this.suppliers.filter((item) => {
      return item?.name.toLowerCase().indexOf(value) > -1;
    });
  }

  filterProduct(data: string) {
    const value = data?.toString().toLowerCase();
    this.productsOptions = this.products.filter((item) => {
      return item?.title.toLowerCase().indexOf(value) > -1;
    });
  }

  displayFn(supplier: Supplier) {
    return supplier ? supplier.ruc + ' - ' + supplier.name : supplier;
  }

  add_item(item: Product) {
    const product = this.details.find((x: any) => x.product == item._id);

    if (product) {
      product.quantity += 1;
      product.price = item.price;
    } else {
      this.details.unshift({
        product: item._id,
        title: item.title,
        price: item.price,
        image: item.image?.secure_url,
        quantity: 1,
      });
    }
    this.dataSource._updateChangeSubscription();
    this.product.reset('');
    this.calculate_total();
  }

  del_item(i: number) {
    this.details.splice(i, 1);
    this.dataSource._updateChangeSubscription();
    this.calculate_total();
  }

  increase_qty(i: number) {
    this.details[i].quantity = this.details[i].quantity + 1;
    this.calculate_total();
  }

  decrease_qty(i: number) {
    if (this.details[i].quantity <= 1) {
      this.details[i].quantity = 1;
    } else {
      this.details[i].quantity = this.details[i].quantity - 1;
    }
    this.calculate_total();
  }

  keyupPrice(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    this.details[i].price = Number(input.value) || 1;
    this.calculate_total();
  }

  keyupQuantity(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    this.details[i].quantity = Number(input.value) || 1;
    this.calculate_total();
  }

  calculate_total() {
    let total = 0;
    let count = 0;
    for (let item of this.details) {
      total += item.price * item.quantity;
      count += item.quantity;
    }
    this.total = total;
    this.count = count;
    localStorage.setItem('details', JSON.stringify(this.details));
  }

  create_data() {
    if (this.details.length === 0) {
      this.alertService.error('Seleccione un producto.');
      return;
    }

    if (this.supplier.invalid) {
      this.supplier.markAsTouched();
      return;
    }

    const data: any = {
      supplier: this.supplier.value,
      amount: this.total,
      details: this.details,
    };

    this.loadButton = true;
    this.purchaseService.create_purchase(data).subscribe({
      next: (res) => {
        this.loadButton = false;
        if (!res.data) {
          return this.alertService.error(res.msg);
        }
        this.supplier.reset('');
        this.details = [];
        this.dataSource = new MatTableDataSource(this.details);
        this.alertService.success('Se registró correctamente');
        localStorage.setItem('details', JSON.stringify(this.details));
      },
      error: (err) => {
        this.loadButton = false;
        console.log(err);
      },
    });
  }

  init_suppliers() {
    this.supplierService.read_all_suppliers().subscribe({
      next: (res) => {
        this.suppliers = res.data;
        this.suppliersOptions = res.data;
      },
    });
  }

  init_products() {
    this.productService.read_all_products().subscribe({
      next: (res) => {
        this.products = res;
        this.productsOptions = res;
      },
    });
  }

  create_supplier(): void {
    const dialogRef = this.dialog.open(FormsSupplierComponent, {
      data: { data: null, new_data: true },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.init_suppliers();
      }
    });
  }
}
