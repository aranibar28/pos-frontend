import { CommonModule } from '@angular/common';
import { Component, Output, OnInit, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
  ],
  templateUrl: './filter-card.component.html',
})
export class FilterCardComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public params = this.activatedRoute.snapshot.queryParams;

  public myForm: FormGroup = this.fb.group({
    search: this.params['search'] || '',
    status: this.params['status'] || '',
    order: this.params['order'] || '',
  });

  @Output() data = new EventEmitter<any>();
  @Output() reset = new EventEmitter<boolean>();

  ngOnInit() {
    this.myForm.controls['search'].valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        this.routerNavigate('search', value);
        this.data.emit({ type: 'search', value: String(value) });
      });

    this.myForm.controls['status'].valueChanges.subscribe((value) => {
      this.routerNavigate('status', value);
      this.data.emit({ type: 'status', value: String(value) });
    });

    this.myForm.controls['order'].valueChanges.subscribe((value) => {
      this.routerNavigate('order', value);
      this.data.emit({ type: 'order', value: String(value) });
    });
  }

  routerNavigate(params: string, value: string | null) {
    if (value) {
      this.router.navigate([], {
        queryParams: { [params]: value?.trim() },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        queryParams: { [params]: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  onReset() {
    this.myForm.reset(
      { search: '', status: '', order: '' },
      { emitEvent: false }
    );
    this.router.navigate([], { queryParams: {} });
    this.reset.emit(true);
  }
}
