import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  menuItems = [
    { link: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Panel', exact: true },
    { link: '/dashboard/ticket-create', icon: 'bi-plus-square-fill', label: 'Nuevo' },
    { link: '/dashboard/tickets', icon: 'bi-ticket-detailed-fill', label: 'Tickets' },
    { link: '/dashboard/reports', icon: 'bi-pie-chart-fill', label: 'Stats' },
    { link: '/dashboard/profile', icon: 'bi-person-badge-fill', label: 'Perfil' },
  ];
  public userName = computed<string>(() => this._authService.getUserInfo().username);
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAdmin = computed<boolean>(() => this.userRole() === 'ADMIN');

  constructor(private _authService: AuthService, private router: Router) {}

  logout(): void {
    this._authService.clearToken();
    this.router.navigate(['/']);
  }
}
