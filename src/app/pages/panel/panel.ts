import { Component, computed, inject, signal } from '@angular/core';
import { Loading } from '../../components/loading/loading';
import { TicketPagination } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';
import { DashEmpty } from '../dash-empty/dash-empty';
import { DashInfo } from '../dash-info/dash-info';

@Component({
  selector: 'app-panel',
  imports: [DashEmpty, DashInfo, Loading],
  templateUrl: './panel.html',
})
export class Panel {
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAgent = computed<boolean>(() => this.userRole() === 'AGENT');
  public isAdmin = computed<boolean>(() => this.userRole() === 'ADMIN');
  public totalTickets = computed<number>(() => this.paginationData()?.totalElements ?? 0);
  public paginationData = signal<TicketPagination | null>(null);
  public currentPage = signal<number>(0);
  public loading = signal<boolean>(false);
  public pageSize = 8;

  constructor(
    private _authService: AuthService,
    private _ticketService: TicketService,
    private _toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.loadTickets(0);
  }

  public loadTickets(page: number): void {
    this.loading.set(true);
    this._ticketService.getTicketsPaginated(page, this.pageSize).subscribe({
      next: (response) => {
        if (this.isAgent()) {
          this._ticketService.getTicketsByAgent().subscribe({
            next: (response) => {
              this.paginationData.set(response);
              this.currentPage.set(page);
              this.loading.set(false);
            },
            error: (err) => {
              this._toastService.show(err.error?.message, 'error');
            },
          });
        }
        this.paginationData.set(response);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this._toastService.show('error');
        this.loading.set(false);
      },
    });
  }
}
