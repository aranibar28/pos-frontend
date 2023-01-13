import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RoleService } from 'src/app/services/role.service';
import { AlertService } from 'src/app/common/alert.service';
import { User, Rol, Business } from 'src/app/utils/intefaces';
import { FORMS_MODULES } from 'src/app/utils/modules';

@Component({
  selector: 'app-forms-branch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-branch.component.html',
})
export class FormsBranchComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<FormsBranchComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  private roleService = inject(RoleService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    user: [{ value: '', disabled: true }],
    role: [, Validators.required],
    business: [, Validators.required],
  });

  public titleModal: string = 'Actualizar Permisos';
  public titleButton: string = 'Actualizar';
  public colorButton: string = 'primary';
  public loadButton: boolean = false;
  public id: string = '';

  public users: User[] = [];
  public roles: Rol[] = [];
  public business: Business[] = [];

  ngOnInit(): void {
    const { data, users, roles, business } = this.dialogData;
    this.users = users;
    this.roles = roles;
    this.business = business;
    this.id = data._id;

    this.myForm.patchValue({
      user: data.user._id,
      role: data.role._id,
      business: data.business._id,
    });
  }

  onClick() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.loadButton = true;
    this.roleService.update_branch(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;

        if (!res.data) {
          return this.alertService.error(res.msg);
        }

        this.dialogRef.close(res);
        this.alertService.success('Se actualizó correctamente');
      },
      error: (err) => {
        this.loadButton = false;
        console.log(err);
      },
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onLoading(): boolean {
    return (this.myForm.pristine && this.myForm.valid) || this.loadButton;
  }
}
