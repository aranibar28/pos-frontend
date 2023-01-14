import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, pairwise } from 'rxjs';
import * as moment from 'moment';

import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { SaleService } from 'src/app/services/sale.service';
import { Sale } from 'src/app/utils/intefaces';
import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';
import { MatDialog } from '@angular/material/dialog';
import { DetailsSaleComponent } from '../details-sale/details-sale.component';

const columns = [
  'customer',
  'type',
  'voucher',
  'amount',
  'tax',
  'created_at',
  'actions',
];

@Component({
  selector: 'app-index-sale',
  standalone: true,
  imports: [
    SHARED_MODULES,
    TABLE_MODULES,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './index-sale.component.html',
})
export class IndexSaleComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  private subscription: Subscription = new Subscription();
  private saleService = inject(SaleService);
  private activatedRoute = inject(ActivatedRoute);
  private spinner = inject(NgxSpinnerService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<Sale[]>;

  public totalItems: number = 0;
  public currentPage: number = 1;
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public start: string = '';
  public end: string = '';

  public range: FormGroup = this.fb.group({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        const { page, limit, start, end } = params;
        this.currentPage = page || 1;
        this.pageSize = limit || 10;
        this.start = start;
        this.end = end;
        this.init_data(this.currentPage, this.pageSize, this.start, this.end);
      }
    );
    this.rangeChanged();
    this.setValuesDate();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  init_data(page?: number, limit?: number, start?: string, end?: string) {
    const params = start && end ? { page, limit, start, end } : { page, limit };
    this.spinner.show();
    this.saleService.read_sales(params).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.docs);
        this.dataSource.sort = this.sort;
        this.totalItems = res.totalDocs;
        this.pageIndex = res.page - 1;
        this.pageSize = res.limit;
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide();
      },
    });
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    const queryParams = {
      page: this.currentPage === 1 ? undefined : this.currentPage,
      limit: this.pageSize === 10 ? undefined : this.pageSize,
    };

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  rangeChanged() {
    this.range.valueChanges.pipe(pairwise()).subscribe(([prev, curr]) => {
      if (curr.start && curr.end && curr.end !== prev.end) {
        this.start = moment(curr.start).format('DD-MM-YYYY');
        this.end = moment(curr.end).format('DD-MM-YYYY');
        this.router.navigate([], {
          queryParams: { start: this.start, end: this.end },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  showDetails(data: any) {
    this.dialog.open(DetailsSaleComponent, {
      data: data,
      width: '780px',
    });
  }

  onReset() {
    this.range.reset();
    this.router.navigate([], { queryParams: {} });
  }

  private setValuesDate() {
    if (this.start && this.end) {
      const startDate = this.transformDate(this.start);
      const endDate = this.transformDate(this.end);
      this.range.setValue({ start: startDate, end: endDate });
    }
  }

  private transformDate(date: string): Date {
    const dateParts = date.split('-');
    const fixedDate = `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`;
    return new Date(fixedDate);
  }
}
