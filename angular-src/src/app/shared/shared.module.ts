/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/** Custom Modules */
import { IconsModule } from './icons.module';
import { MaterialModule } from './material.module';

/** Custom Components */
import { ToolbarComponent } from './toolbar/toolbar.component';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';

/**
 * Shared Module
 *
 * Modules and components that are shared throughout the application should be here.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ToolbarComponent,
    EmailDialogComponent
  ],
  exports: [
    ToolbarComponent,
    CommonModule,
    IconsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    EmailDialogComponent
  ]
})
export class SharedModule { }
