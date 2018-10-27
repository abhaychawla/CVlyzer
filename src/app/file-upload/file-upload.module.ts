import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FileUploadRoutingModule } from './file-upload.routing.module';
import { FileUploadComponent } from './file-upload.component';

@NgModule({
  imports: [
    SharedModule,
    FileUploadRoutingModule
  ],
  declarations: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
