/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** rxjs Imports */
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { AlertService } from '../alert/alert.service';

/** Custom Interceptors */
import { AuthenticationInterceptor } from './authentication.interceptor';

/** Custom Models */
import { RegisterContext } from './register-context.model';
import { LoginContext } from './login-context.model';

/**
 * Authentication workflow.
 */
@Injectable()
export class AuthenticationService {

  private credentialsKey = 'cvlyzerCredentials';

  constructor(private http: HttpClient,
              private alertService: AlertService,
              private authenticationInterceptor: AuthenticationInterceptor) {
                const savedCredentials = JSON.parse(localStorage.getItem(this.credentialsKey));

                if (savedCredentials) {
                  this.authenticationInterceptor.setAuthorizationToken(savedCredentials.token);
                }
               }

  /**
   * Registers the user.
   * @param {RegisterContext} registerContext Registration parameters.
   * @returns {Observable<boolean>} True if registration is successful.
   */
  register(registerContext: RegisterContext) {
    this.alertService.alert({ type: 'Registration Start', message: 'Please wait...' });
    return this.http.post(`http://localhost:8080/api/user/register`, registerContext);
  }

  login(loginContext: LoginContext) {
    this.alertService.alert({ type: 'Authentication Start', message: 'Please wait...' });
    return this.http.post(`http://localhost:8080/api/user/authenticate`, loginContext)
    .pipe(
      map((credentials: any) => {
        this.onLoginSuccess(credentials);
        return of(true);
      })
    );
  }

  private onLoginSuccess(credentials: any) {
    this.authenticationInterceptor.setAuthorizationToken(credentials.token);
    this.setCredentials(credentials);
    this.alertService.alert({ type: 'Authentication Success', message: `${credentials.username} successfully logged in!` });
  }

  private setCredentials(credentials?: any) {
    if (credentials) {
      localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(this.credentialsKey);
    }
  }

  isAuthenticated() {
    return !!(JSON.parse(localStorage.getItem(this.credentialsKey)));
  }

  logout() {
    this.authenticationInterceptor.removeAuthorization();
    this.setCredentials();
    return of(true);
  }

  getCredentials(): any | null {
    return JSON.parse(localStorage.getItem(this.credentialsKey));
  }

}
