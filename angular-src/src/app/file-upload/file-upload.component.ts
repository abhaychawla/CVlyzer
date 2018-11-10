import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import {Subscription} from "rxjs";

import { FileSystemFileEntry } from 'ngx-file-drop';

import { FileUploadService } from './file-upload.service';
import { AlertService } from "../core/alert/alert.service";

/**
 *
 */
@Component({
  selector: 'cvlyzer-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  /** */
  filesToUpload: Array<File> = [];
  /** */
  displayedColumns: string[] = ['sno', 'name', 'lastModifiedDate'];
  /** */
  dataSource: MatTableDataSource<any>;
  /** */
  alert$: Subscription;

  /**
   * @param fileUploadService
   * @param alertService
   * @param router
   */
  constructor(private fileUploadService: FileUploadService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit() {
  }

  fileDrop(event: any) {
    this.filesToUpload = [];
    if (event.files) {
      for (const droppedFile of event.files) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            this.filesToUpload.push(file);
          });
        }
      }
    }
    this.updateTable();
  }

  fileChange(fileInput: any) {
    this.filesToUpload = [];
    if (fileInput.target.files) {
      for (const file of fileInput.target.files) {
        this.filesToUpload.push(file);
      }
    }
    this.updateTable();
  }

  updateTable() {
    this.dataSource = new MatTableDataSource(this.filesToUpload);
  }

  upload() {
    this.alertService.alert({ type: 'Upload Start', message: 'Please wait...' });

    const formData: any = new FormData();

    for (const file of this.filesToUpload) {
      formData.append("file", file, file['name']);
    }

    this.fileUploadService.uploadFiles(formData).subscribe((response: any) => {
      this.alertService.alert({ type: 'Upload Success', message: 'Resumes Uploaded! Please wait while parsing their data...' });
      this.fileUploadService.parseFiles(response.files).subscribe(res => {
        this.alertService.alert({ type: 'Parse Success', message: 'Resumes Parsed!' });
        this.router.navigate(['/applicants']);
      });
    });
  }

}
