import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const val = value.toUpperCase();

    switch (val) {
      case 'OPEN':
        return $localize`:@@status.open:Pendiente`;
      case 'IN_PROGRESS':
        return $localize`:@@status.in_progress:En progreso`;
      case 'CLOSED':
        return $localize`:@@status.closed:Cerrado o cancelado`;
      case 'RESOLVED':
        return $localize`:@@status.resolved:Resuelto`;
      default:
        return value;
    }
  }
}
