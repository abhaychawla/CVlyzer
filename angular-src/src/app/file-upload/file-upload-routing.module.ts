/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { FileUploadComponent } from './file-upload.component';

import { AuthenticationGuard } from '../core/authentication/authentication.guard';

/** File Upload Routes */
const routes: Routes = [
  {
    path: 'resume-upload',
    component: FileUploadComponent,
    data: { title: 'Upload Resumes' },
    canActivate: [AuthenticationGuard]
  }
];

/**
 * File Upload Routing Module
 *
 * Configures the file upload routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FileUploadRoutingModule { }
