import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, AuthResponse, UserClaims } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _tokenKey = 'identity';

  constructor(private _http: HttpClient, private _api: ApiService) {}

  login({ email, password }: LoginRequest): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(this._api.endpoint('/auth/login'), { email, password });
  }

  register(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(this._api.endpoint('/auth/register'), {
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

  getToken(): string {
    return localStorage.getItem(this._tokenKey) || '';
  }

  setToken(token: string): void {
    localStorage.setItem(this._tokenKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this._tokenKey);
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

  getUserInfo(): UserClaims {
    const token = this.getToken();
    if (!token) return { sub: '', username: '', role: '' };

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        sub: payload.sub || '',
        username: payload.username || '',
        role: payload.role || '',
      };
    } catch (err: any) {
      console.error(err);
      return { sub: '', username: '', role: '' };
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
