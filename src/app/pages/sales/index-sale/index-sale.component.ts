import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, shareReplay } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/common/alert.service';
import { User, Product, Details } from 'src/app/utils/intefaces';
import { RequireMatch } from 'src/app/utils/require-match';
import { numberToCardinal } from 'src/app/utils/written-number';
import { FormsUserComponent } from 'src/app/pages/users/forms-user/forms-user.component';
import { BusinessCardComponent } from 'src/app/shared/business-card/business-card.component';

import {
  SHARED_MODULES,
  TABLE_MODULES,
  FORMS_MODULES,
} from 'src/app/utils/modules';

const columns = ['image', 'title', 'quantity', 'price', 'subtotal', 'actions'];
const validators = [Validators.required, RequireMatch];

@Component({
  selector: 'app-index-sale',
  standalone: true,
  imports: [
    SHARED_MODULES,
    FORMS_MODULES,
    TABLE_MODULES,
    BusinessCardComponent,
  ],
  templateUrl: './index-sale.component.html',
})
export class IndexSaleComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;
  public loadButton: boolean = false;

  public user = new FormControl('', validators);
  public users: User[] = [];
  public usersOptions: User[] = [];

  public product = new FormControl('');
  public products: Product[] = [];
  public productsOptions: Product[] = [];

  public details: Details[] = [];
  public total: number = 0;
  public count: number = 0;
  public import: string = '';

  ngOnInit(): void {
    this.getData();
    this.details = JSON.parse(localStorage.getItem('details') || '[]');
    this.dataSource = new MatTableDataSource(this.details);
  }

  ngAfterViewInit(): void {
    this.user.valueChanges.subscribe((value) => this.filterUser(value));
    this.product.valueChanges.subscribe((value) => this.filterProduct(value));
    this.dataSource.connect().subscribe((data) => this.updateTotal(data));
  }

  private filterUser(value: string | null) {
    const transformValue = String(value).trim().toLowerCase();
    this.usersOptions = this.users.filter((item) =>
      item.full_name.toLowerCase().includes(transformValue)
    );
  }

  private filterProduct(value: string | null) {
    const transformValue = String(value).trim().toLowerCase();
    this.productsOptions = this.products.filter((item) =>
      item.title.toLowerCase().includes(transformValue)
    );
  }

  private updateTotal(data: Details[]) {
    this.total = data.reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.count = data.reduce((acc, item) => acc + item.quantity, 0);
    this.import = numberToCardinal(this.total);
    localStorage.setItem('details', JSON.stringify(this.details));
  }

  displayFn(user: User) {
    return user ? `${user.dni} - ${user.full_name}` : user;
  }

  getData() {
    forkJoin([
      this.userService.read_all_users(),
      this.productService.read_all_products_active(),
    ])
      .pipe(shareReplay(1))
      .subscribe(([users, products]) => {
        this.users = users;
        this.usersOptions = users;
        this.products = products;
        this.productsOptions = products;
      });
  }

  refreshUsers() {
    this.userService.read_all_users().subscribe((users) => {
      this.users = users;
      this.usersOptions = users;
    });
  }

  addToShoppingCart(item: Product) {
    const product = this.details.find((x) => x.product == item._id);
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

  changedPrice(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    this.details[i].price = Number(input.value) || 1;
    this.dataSource.data = this.details;
  }

  changedQuantity(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    this.details[i].quantity = Math.round(Number(input.value)) || 1;
    this.dataSource.data = this.details;
  }

  createUser(): void {
    const dialogRef = this.dialog.open(FormsUserComponent, {
      data: { data: null, new_data: true },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      result ? this.refreshUsers() : null;
    });
  }

  onSubmit() {
    if (this.user.invalid) {
      this.user.markAsTouched();
      return;
    }

    if (!this.details.some((item) => item.quantity > 0)) {
      this.alertService.error('Seleccione almenos un producto.');
      return;
    }

    const data: any = {
      user: this.user.value,
      amount: this.total,
      details: this.details,
    };

    this.loadButton = true;

    setTimeout(() => {
      console.log(data);
      this.loadButton = false;
    }, 3000);
  }
}
