import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/common/alert.service';
import { Product, Details } from 'src/app/utils/intefaces';
import { numberToCardinal } from 'src/app/utils/written-number';
import { BusinessCardComponent } from 'src/app/shared/business-card/business-card.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import {
  SHARED_MODULES,
  TABLE_MODULES,
  FORMS_MODULES,
} from 'src/app/utils/modules';

const columns = ['image', 'title', 'quantity', 'price', 'subtotal', 'actions'];

@Component({
  selector: 'app-index-sale',
  standalone: true,
  imports: [
    SHARED_MODULES,
    FORMS_MODULES,
    TABLE_MODULES,
    BusinessCardComponent,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './index-sale.component.html',
})
export class IndexSaleComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;
  public loadButton: boolean = false;

  public product = new FormControl('');
  public products: Product[] = [];
  public productsOptions: Product[] = [];

  public details: Details[] = [];
  public total: number = 0;
  public count: number = 0;
  public import: string = '';

  public minDate = new Date();
  public idCard = new FormControl('dni');
  public maxLenght = 8;

  public myForm: FormGroup = this.fb.group({
    dni: [, [Validators.required]],
    customer: [, [Validators.required, Validators.minLength(3)]],
    address: [],
    date: [this.minDate],
    amount: [],
    details: [],
  });

  ngOnInit(): void {
    this.getData();
    this.searchID();
    this.details = JSON.parse(localStorage.getItem('details') || '[]');
    this.dataSource = new MatTableDataSource(this.details);
  }

  ngAfterViewInit(): void {
    this.product.valueChanges.subscribe((value) => this.filterProduct(value));
    this.dataSource.connect().subscribe((data) => this.updateTotal(data));
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

  getData() {
    this.productService.read_all_products_active().subscribe((res) => {
      this.products = res;
      this.productsOptions = res;
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

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (!this.details.some((item) => item.quantity > 0)) {
      this.alertService.error('Seleccione almenos un producto.');
      return;
    }

    this.myForm.patchValue({
      amount: this.total,
      details: this.details,
    });

    this.loadButton = true;

    setTimeout(() => {
      console.log(this.myForm.value);
      this.loadButton = false;
    }, 3000);
  }

  searchID() {
    this.idCard.valueChanges.subscribe((value) => {
      this.myForm.controls['dni'].reset();
      this.myForm.controls['customer'].reset();
      if (value == 'dni') {
        this.maxLenght = 8;
      } else if (value == 'ruc') {
        this.maxLenght = 11;
      }
    });

    this.myForm.controls['dni'].valueChanges.subscribe((res) => {
      if (String(res).length == this.maxLenght) {
        this.authService
          .consulta_id(res, this.idCard.value!)
          .subscribe((res) => {
            if (res.dni) {
              const first_name = res.nombres;
              const last_name = res.apellidoPaterno + ' ' + res.apellidoMaterno;
              this.myForm.patchValue({
                customer: `${first_name} ${last_name}`,
                address: res.direccion,
              });
            } else if (res.ruc) {
              this.myForm.patchValue({
                customer: res.razonSocial,
                address: res.direccion,
              });
            } else {
              this.alertService.error('No se encontraron resultados');
              this.myForm.patchValue({ customer: '' });
            }
          });
      }
    });
  }

  onlyKeyNumber(event: KeyboardEvent) {
    const regex = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(event.key) || inputElement.value.length >= this.maxLenght) {
      event.preventDefault();
    }
  }
}
