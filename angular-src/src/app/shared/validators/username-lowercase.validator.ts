/** Angular Imports */
import { FormGroup, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

/** Validates that the value of username is in lowercase. */
export function usernameLowercaseValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const username = control;
    return username && (new RegExp(/^[a-z0-9_\-]+$/)).test(username.value) ?  null : { 'lowercase': false };
  };
}
