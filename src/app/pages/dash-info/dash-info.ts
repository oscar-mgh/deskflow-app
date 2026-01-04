import { DatePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Ticket, TicketPagination } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketsService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'dash-info',
  imports: [StatusBadge, RouterLink, DatePipe],
  templateUrl: './dash-info.html',
})
export class DashInfo {
  isAgent = input.required<boolean>();
  isAdmin = input.required<boolean>();
  allTickets = input.required<number>();
  loadAgentTickets = input.required<boolean>();

  public paginationData = signal<TicketPagination | null>(null);
  public currentPage = signal<number>(0);
  public loading = signal<boolean>(false);
  public lastTicketsResolved = signal<Ticket[]>([]);
  public openTickets = signal<Ticket[]>([]);
  public tickets = signal<Ticket[]>([]);
  public inProgressTickets = computed(() =>
    this.tickets().filter((ticket) => ticket.status === 'IN_PROGRESS')
  );
  public resolvedTickets = computed(() =>
    this.tickets().filter((ticket) => ticket.status === 'RESOLVED')
  );
  public slaTickets = computed(() => this.tickets().filter((ticket) => ticket.status === 'CLOSED'));

  constructor(
    private _ticketsService: TicketsService,
    private _router: Router,
    private _authService: AuthService,
    private _toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.loadTickets(0);
  }

  public loadTickets(page: number) {
    this.loading.set(true);

    this._ticketsService.getTicketsPaginated(0, this.allTickets()).subscribe({
      next: (response) => {
        if (this.loadAgentTickets()) {
          this._ticketsService.getTicketsByAgent().subscribe({
            next: (response) => {
              this.tickets.set(response.content);
            },
            error: (err) => {
              this._toastService.show(err.error?.message, 'error');
              console.error('Error cargando tickets', err);
            },
          });
          this.openTickets.set(
            this.tickets().filter(
              (ticket) =>
                ticket.status === 'OPEN' && ticket.agentId === this._authService.getUserInfo().id
            )
          );
        } else {
          this.tickets.set(response.content);
          this.openTickets.set(this.tickets().filter((ticket) => ticket.status === 'OPEN'));
          this.paginationData.set(response);
          this.currentPage.set(0);
        }
        this.lastTicketsResolved.set(
          this.openTickets().filter((ticket) => ticket.status === 'RESOLVED')
        );
        this.loading.set(false);
      },
      error: (err) => {
        this._toastService.show(err.error?.message, 'error');
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
}
