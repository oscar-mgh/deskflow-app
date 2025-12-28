import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority',
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const translations: { [key: string]: string } = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Crítica',
    };

    return translations[value.toUpperCase()] || value;
  }
}
