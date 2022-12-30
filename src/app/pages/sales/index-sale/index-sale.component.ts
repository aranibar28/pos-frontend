import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/common/alert.service';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/utils/intefaces';

import {
  SHARED_MODULES,
  TABLE_MODULES,
  FORMS_MODULES,
} from 'src/app/utils/modules';

interface Details {
  product: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

const columns = ['image', 'title', 'quantity', 'price', 'subtotal', 'actions'];
@Component({
  selector: 'app-index-sale',
  standalone: true,
  imports: [SHARED_MODULES, FORMS_MODULES, TABLE_MODULES],
  templateUrl: './index-sale.component.html',
})
export class IndexSaleComponent implements OnInit, AfterViewInit {
  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;

  public product = new FormControl('');
  public products: Product[] = [];
  public productsOptions: Product[] = [];

  public details: Details[] = [];

  public total: number = 0;
  public count: number = 0;

  ngOnInit(): void {
    this.details = JSON.parse(localStorage.getItem('details') || '[]');
    this.dataSource = new MatTableDataSource(this.details);
    this.getProducts();
    this.dataSource.connect().subscribe((res) => {
      this.updateTotal();
    });
  }

  ngAfterViewInit(): void {
    this.product.valueChanges.subscribe((data) => {
      const value = String(data).trim();
      this.filterProduct(value);
    });
  }

  private filterProduct(data: string) {
    const value = data?.toString().toLowerCase();
    this.productsOptions = this.products.filter((item) => {
      return item?.title.toLowerCase().indexOf(value) > -1;
    });
  }

  getProducts() {
    this.productService.read_all_products().subscribe({
      next: (res) => {
        this.products = res;
        this.productsOptions = res;
      },
    });
  }

  addToShoppingCart(item: Product) {
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
    this.dataSource.data = this.details;
    this.product.reset('');
  }

  removeFromShoppingCart(i: number) {
    this.details.splice(i, 1);
    this.dataSource.data = this.details;
  }

  incrementQuantity(i: number) {
    this.details[i].quantity = this.details[i].quantity + 1;
    this.dataSource.data = this.details;
  }

  decrementQuantity(i: number) {
    this.details[i].quantity = Math.max(1, this.details[i].quantity - 1);
    this.dataSource.data = this.details;
  }

  keyupPrice(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    this.details[i].price = Number(input.value) || 1;
    this.dataSource.data = this.details;
  }

  keyupQuantity(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    this.details[i].quantity = Number(input.value) || 1;
    this.dataSource.data = this.details;
  }

  updateTotal() {
    this.total = this.details.reduce(
      (acc: any, item: any) => acc + item.price * item.quantity,
      0
    );
    this.count = this.details.reduce(
      (acc: any, item: any) => acc + item.quantity,
      0
    );
    localStorage.setItem('details', JSON.stringify(this.details));
  }

  createSale() {
    if (!this.details.some((item: any) => item.quantity > 0)) {
      this.alertService.error('Seleccione un producto.');
      return;
    }

    console.log(this.details);
  }
}
