import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Business, Config } from 'src/app/utils/intefaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './business-card.component.html',
})
export class BusinessCardComponent implements OnInit {
  private authService = inject(AuthService);

  public company: Business = this.authService.company;
  public config: Config = this.authService.config;

  public typeVoucher = new FormControl();
  public serieVoucher = new FormControl();
  public numberVoucher = new FormControl();
  public serie = [];
  public number = [];

  ngOnInit(): void {
    this.valueChanges();
    this.typeVoucher.setValue('ticket');
  }

  valueChanges() {
    this.typeVoucher.valueChanges.subscribe((value: 'invoice' | 'ticket') => {
      this.serie = this.config[value].map((item: any) => item.serie);
      this.number = this.config[value].map((item: any) => item.number);
      const index = this.config[value].findIndex((x: any) => x.status === true);
      this.serieVoucher.setValue(this.serie[index] || '');
    });

    this.serieVoucher.valueChanges.subscribe((value) => {
      const index = this.serie.findIndex((item) => item === value);
      this.numberVoucher.setValue(this.number[index]);
    });
  }

  onlyKeyNumber(event: KeyboardEvent) {
    const regex: RegExp = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(event.key) || inputElement.value.length >= 7) {
      event.preventDefault();
    }
  }

  sendData() {
    console.log(this.typeVoucher.value);
    console.log(this.serieVoucher.value);
    console.log(this.numberVoucher.value);
  }
}
