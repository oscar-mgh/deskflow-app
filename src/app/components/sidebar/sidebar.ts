import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/theme.service';

declare var $localize: any;

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  providers: [ConfigService],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  public config = inject(ConfigService);
  menuItems = [
    {
      link: '/dashboard',
      icon: 'bi-grid-1x2-fill',
      label: $localize`:@@nav.dashboard:Panel`,
      exact: true,
    },
    {
      link: '/dashboard/ticket-create',
      icon: 'bi-plus-square-fill',
      label: $localize`:@@nav.newTicket:Nuevo Ticket`,
    },
    {
      link: '/dashboard/tickets',
      icon: 'bi-ticket-detailed-fill',
      label: $localize`:@@nav.myTickets:Mis Tickets`,
    },
    {
      link: '/dashboard/reports',
      icon: 'bi-pie-chart-fill',
      label: $localize`:@@nav.stats:Estadísticas`,
    },
    {
      link: '/dashboard/profile',
      icon: 'bi-person-badge-fill',
      label: $localize`:@@nav.profile:Mi Perfil`,
    },
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
