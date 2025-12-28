import { DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { TicketPagination } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';
import { PriorityBadge } from "../../components/priority-badge/priority-badge";

@Component({
  selector: 'app-tickets-page',
  imports: [DatePipe, StatusBadge, RouterLink, PriorityBadge],
  templateUrl: './tickets-page.html',
})
export class TicketsPage implements OnInit {
  private _ticketsPage = signal<TicketPagination | null>(null);
  public ticketsPage = this._ticketsPage.asReadonly();
  public tickets = computed(() => this.ticketsPage()?.content || []);

  constructor(private _ticketsService: TicketsService) {}

  ngOnInit(): void {
    this._ticketsService.getTicketsPaginated().subscribe((data) => {
      this._ticketsPage.set(data);
    });
  }

  openTicket(id: string) {
    console.log(id);
  }
}
