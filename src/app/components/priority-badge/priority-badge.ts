import { Component, input, signal } from '@angular/core';
import { PriorityPipe } from "../../pipes/priority.pipe";

@Component({
  selector: 'priority-badge',
  imports: [PriorityPipe],
  templateUrl: './priority-badge.html',
})
export class PriorityBadge {
  public priority = input.required<string>();
  public styles = signal<string>('badge badge-sm font-semibold p-2.5');
}
