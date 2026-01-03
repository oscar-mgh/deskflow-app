import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolePipe',
  standalone: true,
})
export class RolePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const val = value.toUpperCase();

    switch (val) {
      case 'GUEST':
        return $localize`:@@role.guest:Invitado`;
      case 'USER':
        return $localize`:@@role.user:Usuario Estándar`;
      case 'PREMIUM':
        return $localize`:@@role.premium:Usuario Premium`;
      case 'AGENT':
        return $localize`:@@role.agent:Agente`;
      case 'ADMIN':
        return $localize`:@@role.admin:Administrador`;
      default:
        return value;
    }
  }
}
