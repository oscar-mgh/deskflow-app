import { DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketPagination } from '../../models/ticket.model';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { StatusPipe } from '../../pipes/status.pipe';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-tickets-page',
  imports: [DatePipe, RouterLink, PriorityPipe, StatusPipe],
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

  changePage(delta: number) {
    const nextPage = (this.ticketsPage()?.page ?? 0) + delta;
    this._ticketsService.getTicketsPaginated(nextPage).subscribe((data) => {
      this._ticketsPage.set(data);
    });
  }
}
