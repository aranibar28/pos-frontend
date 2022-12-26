import { Component, OnInit, inject } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { RequireMatch } from 'src/app/utils/require-match';

import { RoleService } from 'src/app/services/role.service';
import { AlertService } from 'src/app/common/alert.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { FormsRoleComponent } from '../forms-role/forms-role.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User, Rol, UserRole } from 'src/app/utils/intefaces';

import {
  SHARED_MODULES,
  TABLE_MODULES,
  FORMS_MODULES,
} from 'src/app/utils/modules';

const colums = ['user', 'role', 'status', 'created_at', 'actions'];

@Component({
  selector: 'app-index-role',
  standalone: true,
  imports: [SHARED_MODULES, TABLE_MODULES, FORMS_MODULES],
  templateUrl: './index-role.component.html',
})
export class IndexRoleComponent implements OnInit {
  private roleService = inject(RoleService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
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

  public myForm: FormGroup = this.fb.group({
    user: [, [Validators.required, RequireMatch]],
    role: [, Validators.required],
  });

  ngOnInit(): void {
    this.init_users();
    this.init_roles();
    this.init_user_role();

    this.myForm.controls['user'].valueChanges.subscribe((data) => {
      this.filterData(data);
    });

    this.myForm.controls['role'].valueChanges.subscribe((id) => {
      this.role = this.roles.find((item) => item._id === id);
    });
  }

  filterData(data: string) {
    const value = data.toString().toLowerCase();
    this.usersOptions = this.users.filter((item) => {
      return item?.full_name.toLowerCase().indexOf(value) > -1;
    });
  }

  displayFn(user: User) {
    return user ? user.full_name : user;
  }

  init_users() {
    this.userService.read_all_users().subscribe({
      next: (res) => {
        this.users = res.data;
        this.usersOptions = res.data;
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

  init_user_role() {
    this.spinner.show();
    this.roleService.read_user_role().subscribe({
      next: (res) => {
        this.dataSource = res.data;
        this.spinner.hide();
      },
    });
  }

  create_user_role() {
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
        this.init_user_role();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  update_user_role(item: MatSlideToggleChange, id: string) {
    const status = item.checked;
    this.roleService.update_user_role(id, { status }).subscribe({
      next: (res) => {
        if (!res.data) {
          item.source.checked = !item.source.checked;
          return this.alertService.error(res.msg);
        }
        this.alertService.success('Se cambió el estado correctamente.');
        this.init_user_role();
      },
    });
  }

  delete_user_role(item: UserRole) {
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
            this.init_user_role();
          },
        });
      }
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
        this.init_user_role();
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
            this.init_roles();
            this.alertService.success('Se eliminó correctamente');
          },
        });
      }
    });
  }
}
