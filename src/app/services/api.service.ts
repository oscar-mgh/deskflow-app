import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  public get apiUrl(): string {
    return this.baseUrl;
  }

  public endpoint(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
