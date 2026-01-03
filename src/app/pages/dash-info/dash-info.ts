import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Ticket, TicketPagination } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'dash-info',
  imports: [StatusBadge, RouterLink, DatePipe],
  templateUrl: './dash-info.html',
})
export class DashInfo {
  constructor(
    private _authService: AuthService,
    private _ticketsService: TicketsService,
    private _router: Router
  ) {}

  public userInfo = computed(() => this._authService.getUserInfo());
  public userName = computed<string>(() => this._authService.getUserInfo().username);
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAgent = computed<boolean>(() => this.userRole() === 'AGENT');
  public tickets = signal<Ticket[]>([]);
  public paginationData = signal<TicketPagination | null>(null);
  public currentPage = signal<number>(0);
  public pageSize = 9;
  public loading = signal<boolean>(false);
  public lastTicketsResolved = signal<Ticket[]>([]);
  public openTickets = signal<Ticket[]>([]);

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

    this._ticketsService.getTicketsPaginated(0, this.tickets().length).subscribe({
      next: (response) => {
        this.openTickets.set(response.content.filter((ticket) => ticket.status === 'OPEN'));
        this.lastTicketsResolved.set(
          response.content.filter((ticket) => ticket.status === 'RESOLVED')
        );
        console.log(this.lastTicketsResolved());
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
