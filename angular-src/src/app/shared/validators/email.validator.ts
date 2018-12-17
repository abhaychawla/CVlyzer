/** Angular Imports */
import { FormGroup, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

/** Validates that the value of username is in lowercase. */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const email = control;
    return email && (new RegExp(/[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/)).test(email.value) ?  null : { 'email': false };
  };
}
