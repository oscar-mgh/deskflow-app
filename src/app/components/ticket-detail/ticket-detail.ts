import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { AuthService } from '../../services/auth.service';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  templateUrl: './ticket-detail.html',
  imports: [RouterLink, StatusBadge, PriorityPipe, CommonModule, DatePipe],
})
export class TicketDetailComponent {
  @Input({ required: true }) ticket!: Ticket;
  @Input() isOwner!: boolean;
  @Output() edit = new EventEmitter<void>();

  constructor(private auth: AuthService) {}
}
