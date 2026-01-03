import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, Ticket, TicketPagination } from '../models/ticket.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  public getTicketsPaginated(page: number = 1, size: number = 9): Observable<TicketPagination> {
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
    console.log(this._api.endpoint(`/tickets/${id}`));
    return this._http.patch<Ticket>(this._api.endpoint(`/tickets/${id}`), changes, {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public deleteTicket(id: string): Observable<void> {
    return this._http.delete<void>(this._api.endpoint(`/tickets/${id}`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public getFiles(id: string): Observable<File[]> {
    return this._http.get<File[]>(this._api.endpoint(`/tickets/${id}/files`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public newFile(id: string, file: File): Observable<File> {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<File>(this._api.endpoint(`/tickets/${id}/files`), formData, {
      headers: {
        Authorization: `Bearer ${this._authService.getToken()}`,
      },
    });
  }

  public deleteFile(id: string): Observable<void> {
    return this._http.delete<void>(this._api.endpoint(`/tickets/${id}/files`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public getComments(id: string): Observable<Comment[]> {
    return this._http.get<Comment[]>(this._api.endpoint(`/tickets/${id}/comments`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public newComment(id: string, comment: Comment): Observable<Comment> {
    return this._http.post<Comment>(this._api.endpoint(`/tickets/${id}/comments`), comment, {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }
}
