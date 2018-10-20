/** Angular Imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/** rxjs Imports */
import { Subscription } from 'rxjs';

/** Custom Models */
import { Alert } from '../core/alert/alert.model';

/** Custom Services */
import { AlertService } from '../core/alert/alert.service';
import { AuthenticationService } from '../core/authentication/authentication.service';

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

  constructor(private formBuilder: FormBuilder,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  /**
   * Subscribes to alert event of alert service.
   */
  ngOnInit() {
    this.createLoginForm();
    this.alert$ = this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      const alertType = alertEvent.type;
      this.router.navigate(['/'], { replaceUrl: true });
    });
  }

  /**
   * Creates login form.
   */
  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  login() {
    this.authenticationService.login(this.loginForm.value).subscribe(response => {
      console.log(response);
    });
  }

  googleAuth() {
    window.location.href = 'http://localhost:8080/api/user/authenticate/google';
  }

  /**
   * Unsubscribes from alerts.
   */
  ngOnDestroy() {
    this.alert$.unsubscribe();
  }

}
