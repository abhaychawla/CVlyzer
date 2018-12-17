/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * Email dialog component.
 */
@Component({
  selector: 'cvlyzer-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss']
})
export class EmailDialogComponent implements OnInit {

  emailForm: FormGroup;

  /**
   * @param {MatDialogRef} dialogRef Component reference to dialog.
   * @param {any} data Provides data.
   */
  constructor(public dialogRef: MatDialogRef<EmailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createEmailForm();
  }

  createEmailForm() {
    this.emailForm = this.formBuilder.group({
      'subject': [''],
      'description': ['']
    });
  }

}
