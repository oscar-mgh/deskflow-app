import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket, TicketPagination } from '../models/ticket.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  public getTicketsPaginated(page: number = 1, size: number = 6): Observable<TicketPagination> {
    return this._http.get<TicketPagination>(
      this._api.endpoint(`/tickets?page=${page}&size=${size}`),
      {
        headers: { Authorization: `Bearer ${this._authService.getToken()}` },
      }
    );
  }

  constructor(
    private _http: HttpClient,
    private _api: ApiService,
    private _authService: AuthService
  ) {}

  public getTicketById(id: string): Observable<Ticket> {
    return this._http.get<Ticket>(this._api.endpoint(`/tickets/${id}`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public newTicket(ticket: Ticket): Observable<Ticket> {
    return this._http.post<Ticket>(this._api.endpoint(`/tickets`), ticket, {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public updateTicket(id: string, changes: Partial<Ticket>): Observable<Ticket> {
    return this._http.patch<Ticket>(this._api.endpoint(`/tickets/${id}`), changes, {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public deleteTicket(id: string): Observable<void> {
    return this._http.delete<void>(this._api.endpoint(`/tickets/${id}`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }
}
