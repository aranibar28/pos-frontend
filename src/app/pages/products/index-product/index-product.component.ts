import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FilterCardComponent } from 'src/app/shared/filter-card/filter-card.component';
import { FilterButtonComponent } from 'src/app/shared/filter-button/filter-button.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ImageDialogComponent } from 'src/app/shared/image-dialog/image-dialog.component';
import { FormsProductComponent } from '../forms-product/forms-product.component';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/common/alert.service';
import { Product, Category } from 'src/app/utils/intefaces';
import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';

const columns = [
  'image',
  'title',
  'category',
  'stock',
  'price',
  'status',
  'actions',
];

@Component({
  selector: 'app-index-product',
  standalone: true,
  imports: [
    SHARED_MODULES,
    TABLE_MODULES,
    FilterCardComponent,
    FilterButtonComponent,
  ],
  templateUrl: './index-product.component.html',
})
export class IndexProductComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private spinner = inject(NgxSpinnerService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;
  public products: Product[] = [];
  public categories: Category[] = [];
  public toggle!: boolean;

  public totalItems: number = 0;
  public currentPage: number = 1;
  public pageIndex: number = 1;
  public pageSize: number = 10;

  public search = '';
  public status = '';
  public order = '';

  ngOnInit(): void {
    this.init_categories();
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        const { page, limit, search, status, order } = params;
        this.currentPage = page ? page : 1;
        this.pageSize = limit ? limit : 10;
        this.search = search ? search : '';
        this.status = status ? status : '';
        this.order = order ? order : '';
        this.updatePage();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  init_data(
    page?: number,
    limit?: number,
    search?: string,
    status?: string,
    order?: string
  ) {
    const params = { page, limit, search, status, order };
    this.spinner.show();
    this.productService.read_products(params).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource<Product>(res.docs);
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

  init_categories() {
    this.categoryService.read_all_categories().subscribe((res) => {
      this.categories = res;
    });
  }

  updatePage() {
    this.init_data(
      this.currentPage,
      this.pageSize,
      this.search,
      this.status,
      this.order
    );
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

  filterChanged(data: any) {
    const { type, value } = data;
    if (type == 'search') this.search = value;
    else if (type == 'status') this.status = value;
    else if (type == 'order') this.order = value;
  }

  filterReset(status: boolean) {
    if (status) {
      this.search = '';
      this.status = '';
      this.order = '';
    }
  }

  create_data(): void {
    const dialogRef = this.dialog.open(FormsProductComponent, {
      data: { data: null, categories: this.categories, new_data: true },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      return result && this.updatePage();
    });
  }

  update_data(item: Product): void {
    const dialogRef = this.dialog.open(FormsProductComponent, {
      data: { data: item, categories: this.categories, new_data: false },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      return result && this.updatePage();
    });
  }

  update_image(item: Product) {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: { data: item, type: 'products' },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      return result && this.updatePage();
    });
  }

  delete_data(item: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Estas seguro de eliminar ${item.title}?`,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.delete_product(item._id).subscribe({
          next: (res) => {
            if (!res.data) {
              return this.alertService.error(res.msg);
            }
            this.updatePage();
            this.alertService.success('Se eliminó correctamente');
          },
        });
      }
    });
  }
}
