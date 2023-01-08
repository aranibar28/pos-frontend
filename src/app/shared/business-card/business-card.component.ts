import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Business, Config } from 'src/app/utils/intefaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
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
  private fb = inject(FormBuilder);

  public company: Business = this.authService.company;
  public config: Config = this.authService.config;

  public typeVoucher = new FormControl();
  public serieVoucher = new FormControl();
  public serieNumber = new FormControl();

  public serie = [];
  public number = [];

  ngOnInit(): void {
    this.typeVoucher.valueChanges.subscribe((value: 'invoice' | 'ticket') => {
      this.serie = this.config[value].map((item: any) => item.serie);
      this.number = this.config[value].map((item: any) => item.number);
      this.serieVoucher.setValue(this.serie[0] || '');
    });

    this.serieVoucher.valueChanges.subscribe((value) => {
      const index = this.serie.findIndex((item) => item === value);
      this.serieNumber.setValue(this.number[index] || 1);
    });

    this.typeVoucher.setValue('ticket');
  }
}
