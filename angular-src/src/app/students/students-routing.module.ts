/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../core/authentication/authentication.guard';

import { StudentsComponent } from './students.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';

/** Students Routes */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'applicants',
    pathMatch: 'full'
  },
  {
    path: 'applicants',
    component: StudentsComponent,
    data: { title: 'Applicants' },
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'applicants/view/:id',
    component: StudentDetailComponent,
    data: { title: 'View Applicant' },
    canActivate: [AuthenticationGuard]
  }
];

/**
 * Students Routing Module
 *
 * Configures the students routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class StudentsRoutingModule { }
