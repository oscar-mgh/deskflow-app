import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styles: ``,
})
export class StatusBadge {
  status = input.required<string>();
}
