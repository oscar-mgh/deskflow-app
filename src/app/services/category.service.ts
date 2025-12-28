import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  public getCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(this._api.endpoint(`/categories`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  constructor(
    private _http: HttpClient,
    private _api: ApiService,
    private _authService: AuthService
  ) {}

  public getCategoryById(id: string): Observable<Category> {
    return this._http.get<Category>(this._api.endpoint(`/categories/${id}`), {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }

  public newCategory(category: Category): Observable<Category> {
    return this._http.post<Category>(this._api.endpoint(`/categories`), category, {
      headers: { Authorization: `Bearer ${this._authService.getToken()}` },
    });
  }
}
