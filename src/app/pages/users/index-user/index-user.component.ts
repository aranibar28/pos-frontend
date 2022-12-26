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
import { FormsUserComponent } from '../forms-user/forms-user.component';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/common/alert.service';
import { User } from 'src/app/utils/intefaces';
import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';

export const columns = [
  'full_name',
  'email',
  'dni',
  'created_at',
  'status',
  'actions',
];

@Component({
  selector: 'app-index-user',
  standalone: true,
  imports: [
    SHARED_MODULES,
    TABLE_MODULES,
    FilterCardComponent,
    FilterButtonComponent,
  ],
  templateUrl: './index-user.component.html',
})
export class IndexUserComponent implements OnInit {
  private userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private spinner = inject(NgxSpinnerService);
  private dialog = inject(MatDialog);

  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;
  public users: User[] = [];

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
    this.userService
      .read_users(pageIndex, this.limit, this.search, this.status, this.order)
      .subscribe({
        next: (res) => {
          this.users = res.docs;
          this.dataSource = new MatTableDataSource(res.docs);
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
    const dialogRef = this.dialog.open(FormsUserComponent, {
      data: { data: null, new_data: true },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      return result && this.init_data();
    });
  }

  update_data(item: User): void {
    const dialogRef = this.dialog.open(FormsUserComponent, {
      data: { data: item, new_data: false },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      return result && this.init_data(1);
    });
  }

  delete_data(item: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Estas seguro de eliminar ${item.full_name}?`,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.delete_user(item._id).subscribe({
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
}
