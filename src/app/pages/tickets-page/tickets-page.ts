import { DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Loading } from '../../components/loading/loading';
import { PriorityBadge } from '../../components/priority-badge/priority-badge';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Ticket, TicketPagination } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketsService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-tickets-page',
  imports: [DatePipe, RouterLink, PriorityBadge, StatusBadge, Loading],
  templateUrl: './tickets-page.html',
})
export class TicketsPage implements OnInit {
  public tickets = signal<Ticket[]>([]);
  public paginationData = signal<TicketPagination | null>(null);
  public currentPage = signal<number>(0);
  public loading = signal<boolean>(false);
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAgent = computed<boolean>(() => this.userRole() === 'AGENT');
  public pageSize = 7;

  constructor(
    private _ticketsService: TicketsService,
    private _router: Router,
    private _authService: AuthService,
    private _toastService: ToastService
  ) {}

  public ngOnInit(): void {
    if (this.isAgent()) {
      this.loadTicketsByAgent();
    } else {
      this.loadTickets(0);
    }
  }

  public loadTickets(page: number): void {
    this.loading.set(true);
    this._ticketsService.getTicketsPaginated(page, this.pageSize).subscribe({
      next: (response) => {
        this.tickets.set(response.content);
        this.paginationData.set(response);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: (err) => {
        this._toastService.show(err.error?.message, 'error');
        this.loading.set(false);
      },
    });
  }

  public loadTicketsByAgent(): void {
    this.loading.set(true);
    this._ticketsService.getTicketsByAgent().subscribe({
      next: (response) => {
        this.tickets.set(response.content);
        this.paginationData.set(response);
        this.currentPage.set(0);
        this.loading.set(false);
      },
      error: (err) => {
        this._toastService.show(err.error?.message, 'error');
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

  public openTicket(id: string): void {
    this._router.navigate(['/dashboard/ticket', id]);
  }

  public changePage(delta: number): void {
    const nextPage = (this.paginationData()?.page ?? 0) + delta;
    this.loadTickets(nextPage);
  }
}
