import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, pairwise } from 'rxjs';
import * as moment from 'moment';

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

import { PurchaseService } from 'src/app/services/purchase.service';
import { Purchase } from 'src/app/utils/intefaces';
import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';
const columns = ['supplier', 'amount', 'created_at'];

@Component({
  selector: 'app-list-purchases',
  standalone: true,
  imports: [
    SHARED_MODULES,
    TABLE_MODULES,
    MatSortModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  templateUrl: './list-purchases.component.html',
})
export class ListPurchasesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  private subscription: Subscription = new Subscription();
  private purchaseService = inject(PurchaseService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<Purchase[]>;

  public totalItems: number = 0;
  public currentPage: number = 1;
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public start: string = '';
  public end: string = '';

  public range = new FormGroup({
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
        this.init_purchases(
          this.currentPage,
          this.pageSize,
          this.start,
          this.end
        );
      }
    );
    this.rangeChanged();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  init_purchases(page?: number, limit?: number, start?: string, end?: string) {
    const params = start && end ? { page, limit, start, end } : { page, limit };
    this.purchaseService.read_purchases(params).subscribe({
      next: (res) => {
        res.docs.map((item) => (item.supplier = item.supplier.name));
        this.dataSource = new MatTableDataSource(res.docs);
        this.dataSource.sort = this.sort;
        this.totalItems = res.totalDocs;
        this.pageIndex = res.page - 1;
        this.pageSize = res.limit;
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
}
