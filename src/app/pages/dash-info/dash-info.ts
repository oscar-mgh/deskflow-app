import { DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Ticket, TicketPagination } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'dash-info',
  imports: [StatusBadge, RouterLink, DatePipe],
  templateUrl: './dash-info.html',
})
export class DashInfo {
  constructor(private _ticketsService: TicketsService, private _router: Router) {}

  isAgentOrAdmin = input.required<boolean>();
  allTickets = input.required<number>();

  public paginationData = signal<TicketPagination | null>(null);
  public currentPage = signal<number>(0);
  public loading = signal<boolean>(false);
  public lastTicketsResolved = signal<Ticket[]>([]);
  public openTickets = signal<Ticket[]>([]);

  public ngOnInit(): void {
    this.loadTickets(0);
  }

  public loadTickets(page: number) {
    this.loading.set(true);

    this._ticketsService.getTicketsPaginated(0, this.allTickets()).subscribe({
      next: (response) => {
        this.openTickets.set(response.content.filter((ticket) => ticket.status === 'OPEN'));
        this.lastTicketsResolved.set(
          response.content.filter((ticket) => ticket.status === 'RESOLVED')
        );
      },
      error: (err) => {
        console.error('Error cargando tickets', err);
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
}
