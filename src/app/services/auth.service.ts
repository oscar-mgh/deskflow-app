import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserClaims } from '../models/auth.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _tokenKey = 'identity';

  constructor(private _http: HttpClient, private _api: ApiService) {}

  public login({ email, password }: LoginRequest): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(this._api.endpoint('/auth/login'), { email, password });
  }

  public register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(this._api.endpoint('/auth/register'), registerRequest)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public getToken(): string {
    return localStorage.getItem(this._tokenKey) || '';
  }

  public setToken(token: string): void {
    localStorage.setItem(this._tokenKey, token);
  }

  public clearToken(): void {
    localStorage.removeItem(this._tokenKey);
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  public getUserInfo(): UserClaims {
    const token = this.getToken();
    const emptyUser: UserClaims = {
      id: '',
      sub: '',
      username: '',
      role: '',
      company: '',
    };
    if (!token) return emptyUser;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id || '',
        sub: payload.sub || '',
        username: payload.username || '',
        role: payload.role || '',
        company: payload.company || '',
      };
    } catch (err: any) {
      console.error(err);
      return emptyUser;
    }
  }

  public handleAuthError(err: HttpErrorResponse): string {
    switch (err.status) {
      case 400:
        return 'Algo salió mal, verifica que los datos ingresados sean validos';
      case 401:
        return 'Credenciales inválidas, verifica tu correo y contraseña';
      case 404:
        return 'Usuario no encontrado';
      case 409:
        return 'El correo electrónico ya está registrado';
      case 0:
        return 'No se pudo conectar con el servidor';
      default:
        return 'Ocurrió un error inesperado';
    }
  }
}
