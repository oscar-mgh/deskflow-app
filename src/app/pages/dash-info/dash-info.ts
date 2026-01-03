import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatusBadge } from '../../components/status-badge/status-badge';

@Component({
  selector: 'dash-info',
  imports: [StatusBadge, RouterLink],
  templateUrl: './dash-info.html',
})
export class DashInfo {}
