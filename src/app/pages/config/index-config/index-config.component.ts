import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/common/alert.service';
import { BusinessService } from 'src/app/services/business.service';

import { FORMS_MODULES } from 'src/app/utils/modules';
import { Business } from 'src/app/utils/intefaces';
import { getErrorUnitControl } from 'src/app/utils/validators';

const validators = [Validators.required, Validators.minLength(4)];

@Component({
  selector: 'app-index-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './index-config.component.html',
})
export class IndexConfigComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  private authService = inject(AuthService);
  private businessService = inject(BusinessService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public business = new FormControl('');
  public businesses: Business[] = [];
  public businesses_config: Array<any> = [];

  public typeVoucher = new FormControl('ticket');
  public valueVoucher = new FormControl(null, validators);
  public loadButton = false;

  public myForm: FormGroup = this.fb.group({
    tax: [, [Validators.required]],
    currency: [, [Validators.required]],
    ticket: this.fb.array([
      this.fb.group({
        serie: ['', validators],
        number: ['', Validators.required],
      }),
    ]),
    invoice: this.fb.array([
      this.fb.group({
        serie: ['', validators],
        number: ['', Validators.required],
      }),
    ]),
  });

  get tickets() {
    return (this.myForm.get('ticket') as FormArray).controls;
  }

  get invoices() {
    return (this.myForm.get('invoice') as FormArray).controls;
  }

  ngOnInit(): void {
    this.init_business();
    this.value_changes();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  init_business() {
    forkJoin([
      this.businessService.read_business(),
      this.businessService.read_business_config(),
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([res1, res2]) => {
        this.businesses = res1.data;
        this.businesses_config = res2.data;
        this.business.setValue(this.authService.company._id);
      });
  }

  refreshBusinessConfig() {
    this.businessService.read_business_config().subscribe({
      next: (res) => {
        this.businesses_config = res.data;
      },
    });
  }

  value_changes() {
    this.business.valueChanges.subscribe((id) => {
      const data = this.businesses_config.find((item) => item.business === id);
      this.myForm.patchValue({ tax: data.tax, currency: data.currency });
      this.addItems(data.invoice, 'invoice');
      this.addItems(data.ticket, 'ticket');
    });
    this.typeVoucher.valueChanges.subscribe(() => {
      this.valueVoucher.reset();
    });
  }

  private addItems(items: any[], arrayName: string) {
    (this.myForm.get(arrayName) as FormArray).clear();
    for (const item of items) {
      (this.myForm.get(arrayName) as FormArray).push(
        this.fb.group({
          serie: [item.serie, validators],
          number: [item.number, Validators.required],
        })
      );
    }
  }

  addItem() {
    const value = this.valueVoucher.value;
    if (!value || this.valueVoucher.invalid) {
      this.valueVoucher.markAsTouched();
      return;
    }
    (this.myForm.get(String(this.typeVoucher.value)) as FormArray).push(
      this.fb.group({
        serie: [value, validators],
        number: [1, Validators.required],
      })
    );
    this.valueVoucher.reset();
  }

  removeTicket(index: number) {
    (this.myForm.get('ticket') as FormArray).removeAt(index);
  }

  removeInvoice(index: number) {
    (this.myForm.get('invoice') as FormArray).removeAt(index);
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.loadButton = true;
    this.businessService
      .update_business_config(this.business.value!, this.myForm.value)
      .subscribe({
        next: (res) => {
          this.loadButton = false;
          if (!res) return this.alertService.error(res.msg);
          this.refreshBusinessConfig();
          this.alertService.success('Se actualizó correctamente');
        },
        error: (err) => {
          this.loadButton = false;
          console.log(err);
        },
      });
  }

  onlyKeys(event: KeyboardEvent, type?: string) {
    if (!type) {
      type = this.typeVoucher.value == 'invoice' ? 'F' : 'B';
    }
    const regex: RegExp = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(event.key) || inputElement.value.length >= 4) {
      event.preventDefault();
    }
    if (inputElement.value.length === 0) {
      inputElement.value = type;
    }
  }

  isValid() {
    const input = this.valueVoucher;
    return input.errors && input.touched;
  }

  showMessage() {
    return getErrorUnitControl(this.valueVoucher);
  }
}
