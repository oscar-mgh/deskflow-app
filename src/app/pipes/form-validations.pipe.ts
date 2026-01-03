import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'errorMsg',
  standalone: true,
})
export class FormValidationsPipe implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';

    if (errors['required']) {
      return $localize`:@@errors.required:Este campo es obligatorio`;
    }

    if (errors['email']) {
      return $localize`:@@errors.email:Ingresa un correo válido`;
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;

      return $localize`:@@errors.minlength:Se requieren al menos ${requiredLength}:requiredLength: caracteres`;
    }

    return '';
  }
}
