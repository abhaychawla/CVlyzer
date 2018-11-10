/** Angular Imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/** rxjs Imports */
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

/** Custom Models */
import { Alert } from '../../core/alert/alert.model';

/** Custom Services */
import { AlertService } from '../../core/alert/alert.service';
import { AuthenticationService } from '../../core/authentication/authentication.service';

/** Custom Validators */
import { confirmPasswordValidator } from '../../shared/validators/confirm-password.validator';

/**
 * Registration component.
 */
@Component({
  selector: 'cvlyzer-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  /** Registration form group. */
  registrationForm: FormGroup;
  /** Password input field type. */
  passwordInputType: string;
  confirmPasswordInputType: string;
  /** True if loading. */
  loading = false;
  /** Subscription to alerts. */
  alert$: Subscription;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {AlertService} alertService
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param {Router} router Router for navigation.
   */
  constructor(private formBuilder: FormBuilder,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  /**
   * Creates registration form.
   *
   * Initializes password input field type.
   */
  ngOnInit() {
    this.createRegistrationForm();
    this.passwordInputType = 'password';
    this.confirmPasswordInputType = 'password';
    this.alert$ = this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      const alertType = alertEvent.type;
      if (alertType === 'Registration Success') {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

  /**
   * Creates registration form.
   */
  private createRegistrationForm() {
    this.registrationForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'username': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    }, { validator: confirmPasswordValidator });
  }

  register() {
    this.loading = true;
    this.registrationForm.disable();
    this.authenticationService.register(this.registrationForm.value).pipe(finalize(() => {
      this.registrationForm.reset();
      this.registrationForm.markAsPristine();
      this.registrationForm.enable();
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
