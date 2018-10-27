/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { FileUploadComponent } from './file-upload.component';

import { AuthenticationGuard } from '../core/authentication/authentication.guard';

/** Login Routes */
const routes: Routes = [
  {
    path: 'upload',
    component: FileUploadComponent,
    data: { title: 'Upload Files' },
    canActivate: [AuthenticationGuard]
  }
];

/**
 * Login Routing Module
 *
 * Configures the login routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FileUploadRoutingModule { }
