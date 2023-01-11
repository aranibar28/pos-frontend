import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RoleService } from 'src/app/services/role.service';
import { AlertService } from 'src/app/common/alert.service';
import { sidebar, modules } from 'src/app/utils/sidebar';
import { FORMS_MODULES } from 'src/app/utils/modules';

@Component({
  selector: 'app-forms-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FORMS_MODULES],
  templateUrl: './forms-role.component.html',
})
export class FormsRoleComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<FormsRoleComponent>);
  public dialogData = inject(MAT_DIALOG_DATA);

  private roleService = inject(RoleService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    title: [, [Validators.required, Validators.minLength(3)]],
    allows: this.fb.group(modules),
  });

  public titleModal: string = 'Registrar Rol';
  public titleButton: string = 'Registrar';
  public colorButton: string = 'primary';
  public loadButton: boolean = false;
  public id: string = '';

  public checkedAll = new FormControl(false);
  public indeterminate = false;
  public menu = sidebar;

  ngOnInit(): void {
    const { data, new_data } = this.dialogData;
    if (!new_data) {
      this.titleModal = 'Actualizar Rol';
      this.titleButton = 'Actualizar';
      this.colorButton = 'accent';
      this.myForm.patchValue(data);
      this.id = data._id;
      this.indeterminatedCheck(data.allows);
    }
    this.myForm.controls['allows'].valueChanges.subscribe((item) => {
      this.indeterminatedCheck(item);
    });
  }

  isCheckedAll(event: any) {
    if (event.checked) {
      Object.keys(modules).map((key) => (modules[key] = true));
      this.myForm.controls['allows'].setValue(modules);
    } else {
      Object.keys(modules).map((key) => (modules[key] = false));
      this.myForm.controls['allows'].setValue(modules);
    }
  }

  indeterminatedCheck(item: any) {
    const array = Object.values(item);
    if (array.every(Boolean)) {
      this.checkedAll.setValue(true);
      this.indeterminate = false;
    } else if (array.find((res) => res == true)) {
      this.indeterminate = true;
      this.checkedAll.setValue(false);
    } else {
      this.indeterminate = false;
    }
  }

  create_data() {
    this.loadButton = true;
    this.roleService.create_role(this.myForm.value).subscribe({
      next: (res) => {
        this.loadButton = false;
        if (!res.data) {
          return this.alertService.error(res.msg);
        }
        this.dialogRef.close(true);
        Object.keys(modules).map((key) => (modules[key] = false));
        this.myForm.controls['allows'].setValue(modules);
        this.alertService.success('Se registró correctamente');
      },
      error: (err) => {
        this.loadButton = false;
        console.log(err);
      },
    });
  }

  update_data() {
    this.loadButton = true;
    this.roleService.update_role(this.id, this.myForm.value).subscribe({
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

  onClick() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.id) {
      this.update_data();
    } else {
      this.create_data();
    }
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onLoading(): boolean {
    return (this.myForm.pristine && this.myForm.valid) || this.loadButton;
  }
}
