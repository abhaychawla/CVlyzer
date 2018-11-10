/** Angular Imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/** rxjs Imports */
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

/** Custom Models */
import { Alert } from '../core/alert/alert.model';

/** Custom Services */
import { AlertService } from '../core/alert/alert.service';
import { AuthenticationService } from '../core/authentication/authentication.service';

/** Custom Validators */
import { usernameLowercaseValidator } from '../shared/validators/username-lowercase.validator';

/**
 * Login component.
 */
@Component({
  selector: 'cvlyzer-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  /** Login form group. */
  loginForm: FormGroup;
  /** Password input field type. */
  passwordInputType: string;
  /** True if loading. */
  loading = false;
  /** Subscription to alerts. */
  alert$: Subscription;

  /**
   * @param formBuilder
   * @param alertService
   * @param authenticationService
   * @param router
   */
  constructor(private formBuilder: FormBuilder,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  /**
   * Subscribes to alert event of alert service.
   */
  ngOnInit() {
    this.createLoginForm();
    this.passwordInputType = 'password';
    this.alert$ = this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      const alertType = alertEvent.type;
      if (alertType === 'Authentication Success') {
        this.router.navigate(['/resume-upload'], { replaceUrl: true });
      }
    });
  }

  /**
   * Creates login form.
   */
  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      'username': ['', [
        Validators.required,
        usernameLowercaseValidator()
      ]],
      'password': ['', Validators.required]
    });
  }

  /**
   *
   */
  login() {
    this.loading = true;
    this.loginForm.disable();
    this.authenticationService.login(this.loginForm.value)
      .pipe(finalize(() => {
        this.loginForm.reset();
        this.loginForm.markAsPristine();
        this.loginForm.enable();
        this.loading = false;
      })).subscribe();
  }

  /**
   * Unsubscribes from alerts.
   */
  ngOnDestroy() {
    this.alert$.unsubscribe();
  }

}
