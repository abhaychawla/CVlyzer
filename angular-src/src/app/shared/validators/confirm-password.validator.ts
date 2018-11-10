/** Angular Imports */
import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

/** Validates that the values of password and confirm password are same. */
export const confirmPasswordValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ?  { 'passwordsDoNotMatch': true } : null;
};
