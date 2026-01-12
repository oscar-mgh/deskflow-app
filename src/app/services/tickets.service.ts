import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, Ticket, TicketPagination } from '../models/ticket.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  public headers;

  constructor(
    private _http: HttpClient,
    private _api: ApiService,
    private _authService: AuthService
  ) {
    this.headers = {
      Authorization: `Bearer ${this._authService.getToken()}`,
      'Content-Type': 'application/json',
    };
  }

  public getTicketsPaginated(page: number = 0, size: number = 8): Observable<TicketPagination> {
    return this._http.get<TicketPagination>(
      this._api.endpoint(`/tickets?page=${page}&size=${size}`),
      {
        headers: this.headers,
      }
    );
  }
  public getTicketById(id: string): Observable<Ticket> {
    return this._http.get<Ticket>(this._api.endpoint(`/tickets/${id}`), {
      headers: this.headers,
    });
  }
  public newTicket(ticket: Ticket): Observable<Ticket> {
    return this._http.post<Ticket>(this._api.endpoint(`/tickets`), ticket, {
      headers: this.headers,
    });
  }
  public updateTicket(id: string, changes: Partial<Ticket>): Observable<Ticket> {
    return this._http.patch<Ticket>(this._api.endpoint(`/tickets/${id}`), changes, {
      headers: this.headers,
    });
  }
  public deleteTicket(id: string): Observable<void> {
    return this._http.delete<void>(this._api.endpoint(`/tickets/${id}`), {
      headers: this.headers,
    });
  }
  public getFiles(id: string): Observable<File[]> {
    return this._http.get<File[]>(this._api.endpoint(`/tickets/${id}/files`), {
      headers: this.headers,
    });
  }
  public newFile(id: string, file: File): Observable<File> {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<File>(this._api.endpoint(`/tickets/${id}/files`), formData, {
      headers: this.headers,
    });
  }
  public deleteFile(id: string): Observable<void> {
    return this._http.delete<void>(this._api.endpoint(`/tickets/${id}/files`), {
      headers: this.headers,
    });
  }
  public getComments(id: string): Observable<Comment[]> {
    return this._http.get<Comment[]>(this._api.endpoint(`/tickets/${id}/comments`), {
      headers: this.headers,
    });
  }
  public newComment(id: string, content: string): Observable<Comment> {
    return this._http.post<Comment>(
      this._api.endpoint(`/tickets/${id}/comments`),
      { content },
      {
        headers: this.headers,
      }
    );
  }
  public getTicketsByAgent(page: number = 0, size: number = 8): Observable<TicketPagination> {
    return this._http.get<TicketPagination>(
      this._api.endpoint(
        `/tickets/agent/${this._authService.getUserInfo().id}?page=${page}&size=${size}`
      ),
      {
        headers: this.headers,
      }
    );
  }
}
