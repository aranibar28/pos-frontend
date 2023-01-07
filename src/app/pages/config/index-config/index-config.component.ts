import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/common/alert.service';
import { BusinessService } from 'src/app/services/business.service';

import { FORMS_MODULES } from 'src/app/utils/modules';
import { Business } from 'src/app/utils/intefaces';
import { getErrorUnitControl } from 'src/app/utils/validators';

const validatorTicket = [
  Validators.required,
  Validators.pattern('^B[A-Za-z0-9]{3}$'),
];
const validatorInvoice = [
  Validators.required,
  Validators.pattern('^F[A-Za-z0-9]{3}$'),
];

@Component({
  selector: 'app-index-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './index-config.component.html',
})
export class IndexConfigComponent {
  private authService = inject(AuthService);
  private businessService = inject(BusinessService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public businesses: Business[] = [];
  public businesses_config: Array<any> = [];

  public business = new FormControl('');

  public typeID = new FormControl('ticket');
  public serieValue = new FormControl(null, validatorTicket);

  public myForm: FormGroup = this.fb.group({
    currency: [, [Validators.required]],
    invoice: this.fb.array([
      this.fb.group({
        serie: ['', Validators.required],
        number: ['', Validators.required],
      }),
    ]),
    ticket: this.fb.array([
      this.fb.group({
        serie: ['', Validators.required],
        number: ['', Validators.required],
      }),
    ]),
  });

  get invoices() {
    return (this.myForm.get('invoice') as FormArray).controls;
  }

  get tickets() {
    return (this.myForm.get('ticket') as FormArray).controls;
  }

  ngOnInit(): void {
    this.init_business();
    this.init_business_config();
    this.value_changes();
    this.business.valueChanges.subscribe((id) => {
      const data = this.businesses_config.find((item) => item.business === id);
      this.myForm.patchValue(data);
      console.log(this.myForm.value);
    });
  }

  init_business() {
    this.businessService.read_business().subscribe({
      next: (res) => {
        this.businesses = res.data;
      },
    });
  }

  init_business_config() {
    this.businessService.read_business_config().subscribe({
      next: (res) => {
        this.businesses_config = res.data;
        this.business.setValue(this.authService.company._id);
      },
    });
  }

  value_changes() {
    this.typeID.valueChanges.subscribe((value) => {
      this.serieValue.reset();
      if (value == 'ticket') {
        this.serieValue.setValidators(validatorTicket);
      } else if (value == 'invoice') {
        this.serieValue.setValidators(validatorInvoice);
      }
    });
  }

  addItem() {
    const value = this.serieValue.value;
    if (!value || this.serieValue.invalid) {
      this.serieValue.markAsTouched();
      return;
    } else {
      if (this.typeID.value == 'ticket') {
        (this.myForm.get('ticket') as FormArray).push(
          this.fb.group({
            serie: [value, Validators.required],
            number: [1, Validators.required],
          })
        );
      } else if (this.typeID.value == 'invoice') {
        (this.myForm.get('invoice') as FormArray).push(
          this.fb.group({
            serie: [value, Validators.required],
            number: [1, Validators.required],
          })
        );
      }
      this.serieValue.reset();
    }
  }

  removeItemB(index: number) {
    (this.myForm.get('ticket') as FormArray).removeAt(index);
  }
  
  removeItemF(index: number) {
    (this.myForm.get('invoice') as FormArray).removeAt(index);
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log(this.myForm.value);
  }

  onlyKeys(event: KeyboardEvent) {
    const regex: RegExp = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(event.key) || inputElement.value.length >= 4) {
      event.preventDefault();
    }
    if (inputElement.value.length === 0) {
      inputElement.value = this.typeID.value == 'invoice' ? 'F' : 'B';
    }
  }

  isValid() {
    const input = this.serieValue;
    return input.errors && input.touched;
  }

  showMessage() {
    return getErrorUnitControl(this.serieValue);
  }
}
