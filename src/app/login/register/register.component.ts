/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';

/**
 * Registration component.
 */
@Component({
  selector: 'cvlyzer-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  /** Register form group. */
  registrationForm: FormGroup;
  /** Password input field type. */
  passwordInputType: string;
  confirmPasswordInputType: string;
  /** True if loading. */
  loading = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param {Router} router Router for navigation.
   */
  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) {  }

  /**
   * Creates registration form.
   *
   * Initializes password input field type.
   */
  ngOnInit() {
    this.createRegistrationForm();
    this.passwordInputType = 'password';
    this.confirmPasswordInputType = 'password';
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
    });
  }

  register() {
    this.loading = true;
    this.authenticationService.register(this.registrationForm.value).subscribe(response => {
      console.log(response);
      this.router.navigate(['/login']);
    });
  }

}
