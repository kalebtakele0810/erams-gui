import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.css']
})
export class DatePickerDialogComponent implements OnInit {
  formGroup = new FormGroup({
    date: new FormControl()
  })

  constructor(public dialogRef: MatDialogRef<DatePickerDialogComponent>) {
  }

  ngOnInit(): void {
  }
  onNoClick(){
    this.dialogRef.close(this.formGroup.value.date)
  }

}
