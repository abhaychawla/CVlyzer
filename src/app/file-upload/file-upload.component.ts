import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cvlyzer-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  filesToUpload: Array<File> = [];

  constructor(private fileUploadService: FileUploadService,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    // this.fileUploadService.getFiles().subscribe(res => {
    //   console.log(res);
    // });
  }

  upload() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);

    for(let i =0; i < files.length; i++){
        formData.append("file", files[i], files[i]['name']);
    }
    console.log('form data variable :   '+ formData);
    this.fileUploadService.uploadFiles(formData).subscribe((res: any) => {
      // console.log(res);
      this.fileUploadService.parseFiles(res.files).subscribe(res => {
        console.log(res);
      });
    });
}

fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
}

logout() {
  this.authenticationService.logout();
  this.router.navigate(['/login']);
}

}
