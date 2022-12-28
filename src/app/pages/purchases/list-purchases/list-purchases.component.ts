import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { PurchaseService } from 'src/app/services/purchase.service';
import { Purchase } from 'src/app/utils/intefaces';
import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

const columns = ['supplier', 'amount', 'created_at'];

@Component({
  selector: 'app-list-purchases',
  standalone: true,
  imports: [SHARED_MODULES, TABLE_MODULES, MatSortModule],
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
  public pageSize: number = 5;
  public totalItems: number = 0;

  ngOnInit(): void {
    this.init_purchases(this.currentPage);
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
