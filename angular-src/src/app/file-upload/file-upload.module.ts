import { NgModule } from '@angular/core';

import { FileDropModule } from 'ngx-file-drop';

import { SharedModule } from '../shared/shared.module';
import { FileUploadRoutingModule } from './file-upload-routing.module';

import { FileUploadComponent } from "./file-upload.component";

@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    SharedModule,
    FileDropModule,
    FileUploadRoutingModule
  ]
})
export class FileUploadModule { }
