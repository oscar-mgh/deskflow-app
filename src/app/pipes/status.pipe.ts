import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const translations: { [key: string]: string } = {
      OPEN: 'Pendiente',
      IN_PROGRESS: 'En progreso',
      CLOSED: 'Cerrado o cancelado',
      RESOLVED: 'Resuelto',
    };

    return translations[value.toUpperCase()] || value;
  }
}
