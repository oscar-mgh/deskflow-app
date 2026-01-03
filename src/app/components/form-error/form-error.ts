import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormValidationsPipe } from "../../pipes/form-validations.pipe";

@Component({
  selector: 'app-form-error',
  imports: [FormValidationsPipe],
  templateUrl: './form-error.html',
})
export class FormError {
  @Input() control!: AbstractControl | null;
  @Input() label: string = '';
}
