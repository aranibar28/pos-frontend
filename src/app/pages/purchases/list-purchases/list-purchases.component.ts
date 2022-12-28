import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { pairwise } from 'rxjs';
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
  private purchaseService = inject(PurchaseService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<Purchase[]>;

  public totalItems: number = 0;
  public currentPage = this.activatedRoute.snapshot.queryParams['page'] || 1;
  public pageSize = this.activatedRoute.snapshot.queryParams['limit'] || 10;
  public start = this.activatedRoute.snapshot.queryParams['start'];
  public end = this.activatedRoute.snapshot.queryParams['end'];

  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.init_purchases(this.currentPage, this.pageSize, this.start, this.end);
    this.rangeChanged();
  }

  init_purchases(page?: number, limit?: number, start?: string, end?: string) {
    const params = start && end ? { page, limit, start, end } : { page, limit };
    this.purchaseService.read_purchases(params).subscribe({
      next: (res) => {
        res.docs.map((item) => (item.supplier = item.supplier.name));
        this.dataSource = new MatTableDataSource(res.docs);
        this.dataSource.sort = this.sort;
        this.totalItems = res.totalDocs;
        this.currentPage = res.page - 1;
        this.pageSize = res.limit;
        this.setParams(res.page, res.limit);
      },
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
        this.init_purchases(
          this.currentPage,
          this.pageSize,
          this.start,
          this.end
        );
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.init_purchases(
      this.currentPage + 1,
      this.pageSize,
      this.start,
      this.end
    );
  }

  private setParams(page: number, limit: number) {
    const queryParams = {
      page: page === 1 ? undefined : page,
      limit: limit === 10 ? undefined : limit,
    };
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
