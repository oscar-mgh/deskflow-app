import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority',
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const val = value.toUpperCase();

    switch (val) {
      case 'LOW':
        return $localize`:@@priority.low:Baja`;
      case 'MEDIUM':
        return $localize`:@@priority.medium:Media`;
      case 'HIGH':
        return $localize`:@@priority.high:Alta`;
      case 'CRITICAL':
        return $localize`:@@priority.critical:Crítica`;
      default:
        return value;
    }
  }
}
