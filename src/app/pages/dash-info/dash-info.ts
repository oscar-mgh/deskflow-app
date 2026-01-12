import { DatePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Ticket, TicketPagination } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'dash-info',
  imports: [StatusBadge, RouterLink, DatePipe],
  templateUrl: './dash-info.html',
})
export class DashInfo {
  public isAgent = input.required<boolean>();
  public isAdmin = input.required<boolean>();
  public allTickets = input.required<number>();
  public loadAgentTickets = input.required<boolean>();

  public tickets = signal<Ticket[]>([]);
  public paginationData = signal<TicketPagination | null>(null);
  public currentPage = signal<number>(0);
  public loading = signal<boolean>(false);

  public openTickets = computed(() => this.tickets().filter((ticket) => ticket.status === 'OPEN'));

  public inProgressTickets = computed(() =>
    this.tickets().filter((ticket) => ticket.status === 'IN_PROGRESS')
  );

  public resolvedTickets = computed(() =>
    this.tickets().filter((ticket) => ticket.status === 'RESOLVED')
  );

  public slaTickets = computed(() => this.tickets().filter((ticket) => ticket.status === 'CLOSED'));

  public lastTicketsResolved = computed(() => this.resolvedTickets().slice(0, 5));

  constructor(
    private _ticketService: TicketService,
    private _router: Router,
    private _authService: AuthService,
    private _toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.loadTickets(0);
  }

  public loadTickets(page: number): void {
    this.loading.set(true);

    const ticketsObservable = this.loadAgentTickets()
      ? this._ticketService.getTicketsByAgent(page, 20)
      : this._ticketService.getTicketsPaginated(page, 20);

    ticketsObservable.subscribe({
      next: (response) => {
        this.tickets.set(response.content || []);

        if (!this.loadAgentTickets()) {
          this.paginationData.set(response);
        }

        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this._toastService.show('error');
        this.loading.set(false);
        this.tickets.set([]);
      },
    });
  }

  public goToPage(page: number): void {
    const totalPages = this.paginationData()?.totalPages ?? 0;

    if (page < 0 || page >= totalPages) {
      return;
    }

    this.loadTickets(page);
  }

  public openTicket(id: string): void {
    this._router.navigate(['/dashboard/ticket', id]);
  }
}
