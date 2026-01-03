import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'status-badge',
  imports: [],
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  public status = input.required<string>();
  public styles = signal<string>('badge badge-sm font-semibold p-2.5');
}
