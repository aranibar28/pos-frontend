import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, inject } from '@angular/core';
import { OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from 'src/app/services/auth.service';
import { Business, Config } from 'src/app/utils/intefaces';
import { getErrorMessage } from 'src/app/utils/validators';
import { ImagePipe } from 'src/app/pipes/image.pipe';
import { LengthNumberDirective } from 'src/app/directives/length-number.directive';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    LengthNumberDirective,
    ImagePipe,
  ],
  templateUrl: './business-card.component.html',
})
export class BusinessCardComponent implements OnInit, OnChanges {
  @Output() formData = new EventEmitter<FormGroup>();
  @Input() msgEmitter: string = '';

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    type: [null, Validators.required],
    serie: [null, Validators.required],
    number: [null, [Validators.required, Validators.minLength(7)]],
  });

  public company: Business = this.authService.company;
  public config: Config = this.authService.config;
  public message: { [key: string]: string } = {};
  public form = this.myForm.controls;
  public serie = [];
  public number = [];

  ngOnInit(): void {
    this.initData();
    this.form['type'].setValue('ticket');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['msgEmitter']) {
      let correlative = changes['msgEmitter'].currentValue;
      this.form['number'].setValue(correlative);
      this.updateCorrelative(this.form['type'].value, correlative);
    }
  }

  updateCorrelative(type: 'ticket' | 'invoice', number: string) {
    const serie = this.form['serie'].value;
    if (serie) {
      let i = this.config[type].findIndex((x: any) => x.serie === serie);
      this.config[type][i].number = number;
    }
  }

  initData() {
    const typeChanges = this.form['type'].valueChanges;
    const serieChanges = this.form['serie'].valueChanges;
    const formChanges = this.myForm.valueChanges.pipe(debounceTime(1000));

    typeChanges.subscribe((type: 'ticket' | 'invoice') => {
      const config = this.config[type];
      this.serie = config.map((item: any) => item.serie);
      this.number = config.map((item: any) => item.number);
      const index = config.findIndex((x: any) => x.status === true);
      this.form['serie'].setValue(this.serie[index] || '');
    });

    serieChanges.subscribe((serie) => {
      const index = this.serie.findIndex((item) => item === serie);
      this.form['number'].setValue(this.number[index] || '');
    });

    formChanges.subscribe((value) => {
      const { tax, currency, business } = this.config;
      this.formData.emit({ ...value, tax, currency, business });
    });
  }

  showError(name: string) {
    const input = this.myForm.controls[name];
    if (input.errors && input.touched) {
      return (this.message[name] = getErrorMessage(name, this.myForm));
    } else {
      return (this.message[name] = '');
    }
  }
}
