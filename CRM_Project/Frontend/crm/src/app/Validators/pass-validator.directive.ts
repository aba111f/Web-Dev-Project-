import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPassValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PassValidatorDirective,
      multi: true
    }
  ]
})
export class PassValidatorDirective implements Validator{

  constructor() { }

  validate(control: AbstractControl): { } | null {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { 'uppercase': true };
  }


}
