import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { SHARED_MODULES, TABLE_MODULES } from 'src/app/utils/modules';
import { MatSort } from '@angular/material/sort';
const columns = ['supplier', 'amount', 'voucher', 'created_at'];

@Component({
  selector: 'app-list-purchases',
  standalone: true,
  imports: [SHARED_MODULES, TABLE_MODULES],
  templateUrl: './list-purchases.component.html',
})
export class ListPurchasesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  private dialogRef = inject(MatDialogRef<ListPurchasesComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dialogData);
    this.dataSource.sort = this.sort;
  }
}
