import { DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriorityBadge } from '../../components/priority-badge/priority-badge';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Ticket, TicketPagination } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-tickets-page',
  imports: [DatePipe, RouterLink, PriorityBadge, StatusBadge],
  templateUrl: './tickets-page.html',
})
export class TicketsPage implements OnInit {
  tickets = signal<Ticket[]>([]);
  paginationData = signal<TicketPagination | null>(null);
  currentPage = signal<number>(0);
  pageSize = 8;

  constructor(private _ticketsService: TicketsService) {}

  ngOnInit(): void {
    this.loadTickets(0);
  }

  loadTickets(page: number) {
    this._ticketsService.getTicketsPaginated(page, this.pageSize).subscribe({
      next: (response) => {
        this.tickets.set(response.content);
        this.paginationData.set(response);
        this.currentPage.set(page);
      },
      error: (err) => console.error('Error cargando tickets', err),
    });
  }

  goToPage(page: number): void {
    if (
      page < 0 ||
      (this.paginationData()?.totalPages && page >= this.paginationData()!.totalPages!)
    ) {
      return;
    }
    this.loadTickets(page);
  }

  openTicket(id: string) {
    console.log(id);
  }

  changePage(delta: number) {
    const nextPage = (this.paginationData()?.page ?? 0) + delta;
    this.loadTickets(nextPage);
  }
}
