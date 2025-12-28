import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
})
export class FormError {
  @Input() control!: AbstractControl | null;
  @Input() label: string = '';
}
