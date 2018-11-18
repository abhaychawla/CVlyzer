/** Angular Imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

/** Environment Configuration */
import { environment } from '../../../environments/environment';

/** Custom Services */
import { Logger } from '../logger/logger.service';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../authentication/authentication.service';

/** Initialize Logger */
const log = new Logger('ErrorHandlerInterceptor');

/**
 * Http Request interceptor to add a default error handler to requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  /**
   * @param {Router} router Router for navigation.
   * @param {AlertService} alertService Alert Service.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(private router: Router,
              private alertService: AlertService,
              private authenticationService: AuthenticationService) {  }

  /**
   * Intercepts a Http request and adds a default error handler.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Error handler.
   */
  private handleError(response: HttpErrorResponse): Observable<HttpEvent<any>> {
    const status = response.status;
    let errorMessage = response.error.msg || 'Unknown Error. Please try again later.';
    if (status === 401) {
      errorMessage = 'User unauthorized! Redirecting to Login...';
    }

    if (!environment.production) {
      log.error(`Request Error: ${errorMessage}`);
    }

    if (status === 401) {
      this.alertService.alert({ type: 'Unauthorized', message: errorMessage });
      this.authenticationService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      this.alertService.alert({ type: 'Error', message: errorMessage });
    }

    throw response;
  }

}
