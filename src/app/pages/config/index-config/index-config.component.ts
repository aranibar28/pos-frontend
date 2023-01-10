import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/common/alert.service';
import { BusinessService } from 'src/app/services/business.service';

import { FORMS_MODULES } from 'src/app/utils/modules';
import { Business, Config } from 'src/app/utils/intefaces';
import { getErrorUnitControl } from 'src/app/utils/validators';
import { ImagePipe } from 'src/app/pipes/image.pipe';
import { ImageDialogComponent } from 'src/app/shared/image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const validatorSerie = [Validators.required, Validators.minLength(4)];
const validatorNumber = [Validators.required, Validators.minLength(7)];

@Component({
  selector: 'app-index-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImagePipe, FORMS_MODULES],
  templateUrl: './index-config.component.html',
})
export class IndexConfigComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  private authService = inject(AuthService);
  private businessService = inject(BusinessService);
  private alertService = inject(AlertService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  public loadButton = false;
  public image: string = '';

  public business = new FormControl('');
  public businesses: Business[] = [];
  public businesses_config: Config[] = [];

  public typeVoucher = new FormControl('ticket');
  public valueVoucher = new FormControl(null, validatorSerie);

  public myForm: FormGroup = this.fb.group({
    tax: [, [Validators.required]],
    currency: [, [Validators.required]],
    ticket: this.fb.array([
      this.fb.group({
        serie: ['', validatorSerie],
        number: ['', validatorNumber],
        status: [false],
      }),
    ]),
    invoice: this.fb.array([
      this.fb.group({
        serie: ['', validatorSerie],
        number: ['', validatorNumber],
        status: [false],
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
        this.business.setValue(this.authService.company._id, {
          emitEvent: true,
        });
      });
  }

  refreshBusinessConfig() {
    this.businessService.read_business_config().subscribe({
      next: (res) => {
        this.businesses_config = res.data;
        this.sendChangesToConfigSession();
        this.image = this.matchBusiness(this.business.value).image;
      },
    });
  }

  private matchBusiness(id: string | null): any {
    return this.businesses_config.find((item) => item.business === id);
  }

  private sendChangesToConfigSession() {
    let curr1 = this.authService.business._id;
    let curr2 = this.business.value;
    if (curr1 == curr2) {
      this.authService.business_config = this.matchBusiness(curr1);
    }
  }

  value_changes() {
    this.business.valueChanges.subscribe((id) => {
      const data = this.matchBusiness(id);
      this.myForm.patchValue({ tax: data?.tax, currency: data?.currency });
      this.image = data?.image;
      this.addItems(data?.invoice, 'invoice');
      this.addItems(data?.ticket, 'ticket');
    });
    this.typeVoucher.valueChanges.subscribe(() => {
      this.valueVoucher.reset();
    });
  }

  update_image() {
    const data = { _id: this.business.value, image: this.image };
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: { data, type: 'business' },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshBusinessConfig();
      }
    });
  }

  private addItems(items: any[], arrayName: string) {
    (this.myForm.get(arrayName) as FormArray).clear();
    for (const item of items) {
      (this.myForm.get(arrayName) as FormArray).push(
        this.fb.group({
          serie: [item.serie, validatorSerie],
          number: [item.number, validatorNumber],
          status: [item.status],
        })
      );
    }
  }

  addVoucher() {
    const value = this.valueVoucher.value;
    if (!value || this.valueVoucher.invalid) {
      this.valueVoucher.markAsTouched();
      return;
    }
    (this.myForm.get(String(this.typeVoucher.value)) as FormArray).push(
      this.fb.group({
        serie: [value, validatorSerie],
        number: ['0000001', validatorNumber],
        status: [false],
      })
    );
    this.valueVoucher.reset();
  }

  removeVoucher(index: number, type: string) {
    let voucher = type == 'ticket' ? this.tickets : this.invoices;
    if (voucher[index].value.status === true) {
      this.alertService.error('No puedes eliminar un comprobante activado.');
      return;
    }
    (this.myForm.get(type) as FormArray).removeAt(index);
  }

  changeStatus(i: number, type: string) {
    let voucher = type == 'B' ? this.tickets : this.invoices;
    voucher.forEach((item, index) => {
      if (index == i) {
        item.patchValue({ status: true });
      } else {
        item.patchValue({ status: false });
      }
    });
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

  onlyKeysVoucher(event: KeyboardEvent, type?: string) {
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

  onlyKeysNumber(event: KeyboardEvent, length: number) {
    const regex: RegExp = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(event.key) || inputElement.value.length >= length) {
      event.preventDefault();
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
