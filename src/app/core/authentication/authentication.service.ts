/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable, of } from 'rxjs';
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

  /** Denotes whether the user credentials should persist through sessions. */
  private rememberMe: boolean;

  /**
   * Denotes the type of storage:
   *
   * Session Storage: User credentials should not persist through sessions.
   *
   * Local Storage: User credentials should persist through sessions.
   */
  private storage: any;

  constructor(private http: HttpClient,
              private alertService: AlertService,
              private authenticationInterceptor: AuthenticationInterceptor) { }

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
    return this.http.post(`http://localhost:8080/api/user/authenticate`, loginContext);

    // success store token and user data
    // fail message
  }

  isAuthenticated() {
    return false;
  }

  logout() {
    // clear token user storage
    // navigate to login
  }

}
