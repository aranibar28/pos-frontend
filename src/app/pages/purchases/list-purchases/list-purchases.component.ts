import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { PurchaseService } from 'src/app/services/purchase.service';
import { Purchase } from 'src/app/utils/intefaces';
import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { pairwise } from 'rxjs';
import * as moment from 'moment';

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

  public currentPage = this.activatedRoute.snapshot.queryParams['page'] || 1;
  public pageSize: number = 10;
  public totalItems: number = 0;

  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.init_purchases(this.currentPage);
    this.rangeChanged();
  }

  init_purchases(page?: number, limit?: number) {
    this.purchaseService.read_purchases(page, limit).subscribe({
      next: (res) => {
        res.docs.map((item) => (item.supplier = item.supplier.name));
        this.dataSource = new MatTableDataSource(res.docs);
        this.dataSource.sort = this.sort;
        this.totalItems = res.totalDocs;
        this.currentPage = res.page - 1;
        this.pageSize = res.limit;
        this.setParams(res.page);
      },
    });
  }

  rangeChanged() {
    this.range.valueChanges.pipe(pairwise()).subscribe(([prev, curr]) => {
      if (prev.start !== curr.start || prev.end !== curr.end) {
        if (curr.start && curr.end && curr.end !== prev.end) {
          const start = moment(curr.start).format('L');
          const end = moment(curr.end).format('L');
          console.log(start + ' - ' + end);
        }
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.init_purchases(this.currentPage + 1, this.pageSize);
  }

  private setParams(page: number) {
    if (page == 1) {
      this.router.navigate([], { queryParams: { page: null } });
    } else {
      this.router.navigate([], { queryParams: { page: page } });
    }
  }
}
