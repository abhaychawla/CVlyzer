/** Angular Imports */
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/** Custom Services */
import { AuthenticationService } from './authentication/authentication.service';
import { ProgressBarService } from './progress-bar/progress-bar.service';

/** Custom Guards */
import { AuthenticationGuard } from './authentication/authentication.guard';

/** Custom Interceptors */
import { AuthenticationInterceptor } from './authentication/authentication.interceptor';
import { ProgressInterceptor } from './progress-bar/progress.interceptor';

/**
 * Core Module
 *
 * Main app shell components (if any) and singleton services should be here.
 */
@NgModule({
  imports: [],
  declarations: [],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    AuthenticationInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    ProgressBarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }

}

