import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  public userName = computed<string>(() => this._authService.getUserInfo().username);
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAdmin = computed<boolean>(() => this.userRole() === 'ADMIN');

  constructor(private _authService: AuthService, private router: Router) {}

  logout(): void {
    this._authService.clearToken();
    this.router.navigate(['/']);
  }
}
