import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';

import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { AlertService } from 'src/app/common/alert.service';
import { Product, Details } from 'src/app/utils/intefaces';
import { numberToCardinal } from 'src/app/utils/written-number';
import { getErrorMessage } from 'src/app/utils/validators';
import { BusinessCardComponent } from 'src/app/shared/business-card/business-card.component';
import { DefaultImageDirective } from 'src/app/directives/default-image.directive';

import {
  SHARED_MODULES,
  TABLE_MODULES,
  FORMS_MODULES,
} from 'src/app/utils/modules';

const columns = ['image', 'title', 'quantity', 'price', 'subtotal', 'actions'];
const validatorDNI = [Validators.required, Validators.pattern(/^[0-9]{8}$/)];
const validatorRUC = [Validators.required, Validators.pattern(/^[0-9]{11}$/)];

@Component({
  selector: 'app-forms-sale',
  standalone: true,
  imports: [
    SHARED_MODULES,
    FORMS_MODULES,
    TABLE_MODULES,
    BusinessCardComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    DefaultImageDirective,
  ],
  templateUrl: './forms-sale.component.html',
})
export class FormsSaleComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private saleService = inject(SaleService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;
  public loadButton: boolean = false;

  public product = new FormControl('');
  public products: Product[] = [];
  public productsOptions: Product[] = [];

  public details: Details[] = [];
  public opGrav: number = 0;
  public amount: number = 0;
  public amountLetters: string = '';

  public minDate = new Date();
  public typeID = new FormControl('dni');
  public tax: number = this.authService.config.tax;
  public currency: string = this.authService.config.currency;
  public correlative: string = '';
  public maxLenght: number = 8;

  public myForm: FormGroup = this.fb.group({
    document: [, validatorDNI],
    customer: [, [Validators.minLength(3)]],
    date: [this.minDate],
    address: null,
    business: null,
    serie: [null, [Validators.minLength(4)]],
    number: [null, [Validators.minLength(7)]],
    type: null,
    tax: null,
    amount: null,
    details: [],
  });

  ngOnInit(): void {
    this.getProducts();
    this.getSunatData();
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
    this.amount = data.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    this.opGrav = this.amount * (1 - this.tax);
    this.amountLetters = numberToCardinal(this.amount, this.currency);
    localStorage.setItem('details', JSON.stringify(this.details));
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

  incrementQuantity(item: any, i: number) {
    const product = this.products.find((x) => x._id === item.product);
    const stock = product?.stock;
    if (!stock) return;
    this.details[i].quantity = Math.min(this.details[i].quantity + 1, stock);
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

  changedQuantity(event: Event, item: any, i: number) {
    const input = event.target as HTMLInputElement;
    const product = this.products.find((x) => x._id === item.product);
    let value = Math.round(Number(input.value)) || (input.value === '' ? 0 : 1);
    value = Math.min(value, product?.stock || 1);
    this.details[i].quantity = value;
    this.dataSource.data = this.details;
    input.value = value.toString();
  }

  getFormData(data: any) {
    const { business, serie, number, type, tax } = data;
    this.correlative = number; //Send data from Father to Children.
    this.myForm.patchValue({ business, serie, number, type, tax });
  }

  getProducts() {
    this.productService.read_all_products_active().subscribe((res) => {
      this.products = res;
      this.productsOptions = res;
    });
  }

  getSunatData() {
    this.typeID.valueChanges.subscribe((value) => {
      this.myForm.controls['customer'].reset();
      this.myForm.controls['document'].reset();
      if (value == 'dni') {
        this.maxLenght = 8;
        this.myForm.controls['document'].setValidators(validatorDNI);
      } else if (value == 'ruc') {
        this.maxLenght = 11;
        this.myForm.controls['document'].setValidators(validatorRUC);
      }
    });

    this.myForm.controls['document'].valueChanges.subscribe((res) => {
      if (String(res).length == this.maxLenght) {
        this.authService
          .consulta_id(res, this.typeID.value!)
          .subscribe((res) => {
            if (res.dni) {
              const { nombres, apellidoPaterno, apellidoMaterno } = res;
              this.myForm.patchValue({
                customer: `${nombres} ${apellidoPaterno} ${apellidoMaterno}`,
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
      amount: this.amount,
      details: this.details,
    });

    this.loadButton = true;

    this.saleService.create_sale(this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;
        if (!res.data) {
          return this.alertService.error(res.msg);
        }
        this.myForm.reset({ date: this.minDate });
        this.details = [];
        this.dataSource.data = this.details;
        this.alertService.success('Venta generada.');
        this.getProducts();
        this.correlative = this.nextCorrelative(this.correlative);
      },
    });
  }

  private nextCorrelative(number: string) {
    let num = Number(number) + 1;
    return num.toString().padStart(number.length, '0');
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
