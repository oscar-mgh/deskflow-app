import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Loading } from '../../components/loading/loading';
import { PriorityBadge } from '../../components/priority-badge/priority-badge';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Ticket, TicketPagination } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-tickets-page',
  imports: [DatePipe, RouterLink, PriorityBadge, StatusBadge, Loading],
  templateUrl: './tickets-page.html',
})
export class TicketsPage implements OnInit {
  public tickets = signal<Ticket[]>([]);
  public paginationData = signal<TicketPagination | null>(null);
  public currentPage = signal<number>(0);
  public pageSize = 9;
  public loading = signal<boolean>(false);

  constructor(private _ticketsService: TicketsService, private _router: Router) {}

  public ngOnInit(): void {
    this.loadTickets(0);
  }

  public loadTickets(page: number) {
    this.loading.set(true);
    this._ticketsService.getTicketsPaginated(page, this.pageSize).subscribe({
      next: (response) => {
        this.tickets.set(response.content.sort((a, b) => a.id - b.id));
        this.paginationData.set(response);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando tickets', err);
        this.loading.set(false);
      },
    });
  }

  public goToPage(page: number): void {
    if (
      page < 0 ||
      (this.paginationData()?.totalPages && page >= this.paginationData()!.totalPages!)
    ) {
      return;
    }
    this.loadTickets(page);
  }

  public openTicket(id: string) {
    this._router.navigate(['/dashboard/ticket', id]);
  }

  public changePage(delta: number) {
    const nextPage = (this.paginationData()?.page ?? 0) + delta;
    this.loadTickets(nextPage);
  }
}
