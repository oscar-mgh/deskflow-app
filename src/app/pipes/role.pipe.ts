import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolePipe',
})
export class RolePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const translations: { [key: string]: string } = {
      GUEST: 'Invitado',
      USER: 'Usuario Estandar',
      PREMIUM: 'Usuario Premium',
      AGENT: 'Agente',
      ADMIN: 'Administrador',
    };

    return translations[value.toUpperCase()] || value;
  }
}
