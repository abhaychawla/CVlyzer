/** Angular Imports */
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/** Custom Services */
import { AuthenticationService } from './authentication/authentication.service';

/** Custom Guards */
import { AuthenticationGuard } from './authentication/authentication.guard';

/** Custom Interceptors */
import { AuthenticationInterceptor } from './authentication/authentication.interceptor';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';

/**
 * Core Module
 *
 * Main app shell components and singleton services should be here.
 */
@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    AuthenticationInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
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
