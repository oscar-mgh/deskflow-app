import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'priority-badge',
  imports: [],
  templateUrl: './priority-badge.html',
})
export class PriorityBadge {
  public priority = input.required<string>();
  public styles = signal<string>('badge badge-sm font-medium');
}
