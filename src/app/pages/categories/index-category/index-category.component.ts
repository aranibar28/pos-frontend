import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FilterCardComponent } from 'src/app/shared/filter-card/filter-card.component';
import { FilterButtonComponent } from 'src/app/shared/filter-button/filter-button.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { FormsCategoryComponent } from '../forms-category/forms-category.component';
import { CategoryService } from 'src/app/services/category.service';
import { AlertService } from 'src/app/common/alert.service';
import { Category } from 'src/app/utils/intefaces';
import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';

export const columns = ['title', 'description', 'status', 'actions'];

@Component({
  selector: 'app-index-category',
  standalone: true,
  imports: [
    SHARED_MODULES,
    TABLE_MODULES,
    FilterCardComponent,
    FilterButtonComponent,
  ],
  templateUrl: './index-category.component.html',
})
export class IndexCategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private activatedRoute = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private spinner = inject(NgxSpinnerService);
  private dialog = inject(MatDialog);

  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<Category>;
  public categories: Category[] = [];

  public search = this.activatedRoute.snapshot.queryParams['search'] || '';
  public status = this.activatedRoute.snapshot.queryParams['status'] || '';
  public order = this.activatedRoute.snapshot.queryParams['order'] || '';

  public totalDocs: number = 0;
  public pageIndex: number = 1;
  public limit: number = 10;
  public toggle!: boolean;

  ngOnInit(): void {
    this.init_data();
  }

  init_data(page: number = 0) {
    const pageIndex = page ? this.pageIndex + 1 : 1;
    this.spinner.show();
    this.categoryService
      .read_categories(
        pageIndex,
        this.limit,
        this.search,
        this.status,
        this.order
      )
      .subscribe({
        next: (res) => {
          this.categories = res.docs;
          this.dataSource = new MatTableDataSource<Category>(res.docs);
          this.dataSource.sort = this.sort;
          this.totalDocs = res.totalDocs;
          this.pageIndex = res.page - 1;
          this.limit = res.limit;
          this.spinner.hide();
        },
        error: (err) => {
          console.log(err);
          this.spinner.hide();
        },
      });
  }

  onChange(data: any) {
    const { type, value } = data;
    if (type == 'search') this.search = value;
    else if (type == 'status') this.status = value;
    else if (type == 'order') this.order = value;
    this.init_data();
  }

  onReset(status: boolean) {
    if (status) {
      this.search = '';
      this.status = '';
      this.order = '';
      this.init_data();
    }
  }

  onPageChange(page: PageEvent) {
    this.pageIndex = page.pageIndex;
    this.limit = page.pageSize;
    this.init_data(1);
  }

  create_data(): void {
    const dialogRef = this.dialog.open(FormsCategoryComponent, {
      data: { data: null, new_data: true },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      return result && this.init_data();
    });
  }

  update_data(item: Category): void {
    const dialogRef = this.dialog.open(FormsCategoryComponent, {
      data: { data: item, new_data: false },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      return result && this.init_data(1);
    });
  }

  delete_data(item: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Estas seguro de eliminar ${item.title}?`,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.delete_category(item._id).subscribe({
          next: (res) => {
            if (!res.data) {
              return this.alertService.error(res.msg);
            }
            this.init_data(1);
            this.alertService.success('Se eliminó correctamente');
          },
        });
      }
    });
  }

  exportExcel(): void {
    let array: any = [];

    for (let item of this.categories) {
      let status = item.status ? 'Activo' : 'Desactivado';
      array.push({
        Título: item.title,
        Descripción: item.description,
        Estado: status,
      });
    }
  }
}
