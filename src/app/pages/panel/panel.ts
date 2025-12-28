import { Component, computed, signal } from '@angular/core';
import { TicketPagination } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';
import { DashEmpty } from '../dash-empty/dash-empty';
import { DashInfo } from '../dash-info/dash-info';

@Component({
  selector: 'app-panel',
  imports: [DashEmpty, DashInfo],
  templateUrl: './panel.html',
})
export class Panel {
  private _ticketsPage = signal<TicketPagination | null>(null);
  public ticketsPage = this._ticketsPage.asReadonly();
  public tickets = computed(() => this.ticketsPage()?.content || []);

  constructor(private _ticketsService: TicketsService) {}

  ngOnInit(): void {
    this._ticketsService.getTicketsPaginated().subscribe((data) => {
      this._ticketsPage.set(data);
    });
  }
}
