import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'identity';

  constructor(private http: HttpClient, private api: ApiService) {}

  login({ email, password }: LoginRequest): Observable<string> {
    return this.http.post(
      this.api.endpoint('/auth/login'),
      { email, password },
      { responseType: 'text' as 'text' }
    );
  }

  register(name: string, email: string, password: string): Observable<string> {
    return this.http.post<string>(this.api.endpoint('/auth/register'), {
      fullName: name,
      email,
      password,
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUserEmail(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (err: any) {
      console.error(err);
      return '';
    }
  }
}
