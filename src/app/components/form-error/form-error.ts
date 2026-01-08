import { Component, input, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormValidationsPipe } from "../../pipes/form-validations.pipe";

@Component({
  selector: 'app-form-error',
  imports: [FormValidationsPipe],
  templateUrl: './form-error.html',
})
export class FormError {
control = input<AbstractControl>();
label = input<string>();
}
