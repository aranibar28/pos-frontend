import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import { BusinessService } from 'src/app/services/business.service';
import { AlertService } from 'src/app/common/alert.service';

import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { FormsAllowsComponent } from '../forms-allows/forms-allows.component';
import { FormsRoleComponent } from '../forms-role/forms-role.component';
import { FormsBusinessComponent } from '../forms-business/forms-business.component';
import { User, Rol, Business, UserRole } from 'src/app/utils/intefaces';
import { RequireMatch } from 'src/app/utils/require-match';

import {
  SHARED_MODULES,
  TABLE_MODULES,
  FORMS_MODULES,
} from 'src/app/utils/modules';

const colums = ['user', 'role', 'business', 'status', 'created_at', 'actions'];

@Component({
  selector: 'app-index-role',
  standalone: true,
  imports: [SHARED_MODULES, TABLE_MODULES, FORMS_MODULES],
  templateUrl: './index-role.component.html',
})
export class IndexRoleComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private businessService = inject(BusinessService);
  private alertService = inject(AlertService);
  private spinner = inject(NgxSpinnerService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  public displayedColumns: string[] = colums;
  public dataSource!: MatTableDataSource<UserRole>;

  public users: User[] = [];
  public usersOptions: User[] = [];

  public roles: Rol[] = [];
  public role: any = {};

  public businesses: Business[] = [];
  public business: any = {};

  public myForm: FormGroup = this.fb.group({
    user: [, [Validators.required, RequireMatch]],
    role: [, Validators.required],
    business: [, Validators.required],
  });

  ngOnInit(): void {
    this.init_data();
    this.init_users();
    this.init_roles();
    this.init_business();

    this.myForm.controls['user'].valueChanges.subscribe((value) => {
      this.filterUser(value);
    });

    this.myForm.controls['role'].valueChanges.subscribe((id) => {
      this.role = this.roles.find((item) => item._id === id);
    });

    this.myForm.controls['business'].valueChanges.subscribe((id) => {
      this.business = this.businesses.find((item) => item._id === id);
    });
  }

  filterUser(value: string) {
    const transformValue = String(value).trim().toLowerCase();
    this.usersOptions = this.users.filter((item) =>
      item?.full_name.toLowerCase().includes(transformValue)
    );
  }

  displayFn(user: User) {
    return user ? user.full_name : user;
  }

  init_data() {
    this.spinner.show();
    this.roleService.read_user_role().subscribe({
      next: (res) => {
        this.dataSource = res.data;
        this.spinner.hide();
      },
    });
  }

  init_users() {
    this.userService.read_all_users().subscribe({
      next: (res) => {
        this.users = res;
        this.usersOptions = res;
      },
    });
  }

  init_roles() {
    this.roleService.read_roles().subscribe({
      next: (res) => {
        this.roles = res.data;
      },
    });
  }

  init_business() {
    this.businessService.read_business().subscribe({
      next: (res) => {
        this.businesses = res.data;
      },
    });
  }

  //***** CREATE *****//
  create_data() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.roleService.create_user_role(this.myForm.value).subscribe({
      next: (res) => {
        if (!res.data) {
          return this.alertService.error(res.msg);
        }
        this.alertService.success('Rol asignado correctamente');
        this.init_data();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  create_role(): void {
    const dialogRef = this.dialog.open(FormsRoleComponent, {
      data: { data: null, new_data: true },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.init_roles();
      }
    });
  }

  create_business(): void {
    const dialogRef = this.dialog.open(FormsBusinessComponent, {
      data: { data: null, new_data: true },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.init_business();
      }
    });
  }

  //***** UPDATE *****//
  update_status(item: MatSlideToggleChange, id: string) {
    const status = item.checked;
    this.roleService.update_user_role(id, { status }).subscribe({
      next: (res) => {
        if (!res.data) {
          item.source.checked = !item.source.checked;
          return this.alertService.error(res.msg);
        }
        this.alertService.success('Se cambió el estado correctamente.');
        this.init_data();
      },
    });
  }

  update_data(item: any) {
    const dialogRef = this.dialog.open(FormsAllowsComponent, {
      data: {
        data: item,
        roles: this.roles,
        business: this.businesses,
        users: this.users,
      },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.authService.id == result.data.user) {
          this.authService.business = result.data.business;
          this.authService.business_config = result.config;
        }
        this.init_data();
      }
    });
  }

  update_role(item: Rol): void {
    const dialogRef = this.dialog.open(FormsRoleComponent, {
      data: { data: item, new_data: false },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.role = result.data;

        if (this.authService.role == result.data.title) {
          this.authService.emitterAllow({
            value: result.data.allows,
          });
        }
        this.init_roles();
        this.init_data();
      }
    });
  }

  update_business(item: Business) {
    const dialogRef = this.dialog.open(FormsBusinessComponent, {
      data: { data: item, new_data: false },
      autoFocus: false,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.business = result.data;
        this.init_business();
        this.init_data();
      }
    });
  }

  //***** DELETE *****//
  delete_data(item: UserRole) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Desea remover el rol ${item.role?.title} al usuario ${item.user?.full_name}?`,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roleService.delete_user_role(item._id).subscribe({
          next: (res) => {
            if (!res.data) {
              return this.alertService.error(res.msg);
            }
            this.alertService.success('Se eliminó correctamente.');
            this.init_data();
          },
        });
      }
    });
  }

  delete_role(item: Rol): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Estas seguro de eliminar ${item.title}?`,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roleService.delete_role(item._id).subscribe({
          next: (res) => {
            if (!res.data) {
              return this.alertService.error(res.msg);
            }
            this.alertService.success('Se eliminó correctamente');
            this.init_roles();
          },
        });
      }
    });
  }

  delete_business(item: Business) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Estas seguro de eliminar ${item.title}?`,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.businessService.delete_business(item._id).subscribe({
          next: (res) => {
            if (!res.data) {
              return this.alertService.error(res.msg);
            }
            this.alertService.success('Se eliminó correctamente');
            this.init_business();
          },
        });
      }
    });
  }
}
