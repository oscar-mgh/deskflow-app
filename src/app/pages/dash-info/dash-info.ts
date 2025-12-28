import { Component } from '@angular/core';
import { StatusBadge } from '../../components/status-badge/status-badge';

@Component({
  selector: 'dash-info',
  imports: [StatusBadge],
  templateUrl: './dash-info.html',
})
export class DashInfo {}
