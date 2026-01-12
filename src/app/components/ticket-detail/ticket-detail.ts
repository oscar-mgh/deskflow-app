import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  templateUrl: './ticket-detail.html',
  imports: [RouterLink, StatusBadge, PriorityPipe, CommonModule, DatePipe],
})
export class TicketDetailComponent {
  public ticket = input.required<Ticket>();
  public isOwner = input.required<boolean>();
  public edit = output<void>();
}
