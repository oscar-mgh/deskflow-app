import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'identity';

  constructor(private http: HttpClient, private api: ApiService) {}

  login({ email, password }: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.api.endpoint('/auth/login'), { email, password });
  }

  register(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.api.endpoint('/auth/register'), {
        fullName,
        email,
        password,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
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

  getUserInfo(): { email: string; fullName: string } {
    const token = this.getToken();
    if (!token) return { email: '', fullName: '' };

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub || '',
        fullName: payload.full_name || '',
      };
    } catch (err: any) {
      console.error(err);
      return { email: '', fullName: '' };
    }
  }

  handleAuthError(err: HttpErrorResponse): string {
    switch (err.status) {
      case 401:
        return 'Credenciales inválidas, verifica tu correo y contraseña';
      case 409:
        return 'El correo electrónico ya está registrado';
      case 0:
        return 'No se pudo conectar con el servidor';
      default:
        return 'Ocurrió un error inesperado';
    }
  }
}
