import { Component, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MobileMenu } from '../../components/mobile-menu/mobile-menu';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, RouterOutlet, MobileMenu],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  public agentMenuItems = [
    {
      link: '/dashboard',
      icon: 'bi-grid-1x2-fill',
      label: $localize`:@@nav.dashboard:Panel`,
      exact: true,
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

  public adminMenuItems = [
    {
      link: '/dashboard',
      icon: 'bi-grid-1x2-fill',
      label: $localize`:@@nav.dashboard:Panel`,
      exact: true,
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
    {
      link: '/dashboard/admin',
      icon: 'bi-shield-lock-fill',
      label: $localize`:@@nav.admin:Administrador`,
    },
  ];

  public menuItems = [
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
      link: '/dashboard/profile',
      icon: 'bi-person-badge-fill',
      label: $localize`:@@nav.profile:Mi Perfil`,
    },
  ];

  public userName = computed<string>(() => this._authService.getUserInfo().username);
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAdmin = computed<boolean>(() => this.userRole() === 'ADMIN');
  public isAgent = computed<boolean>(() => this.userRole() === 'AGENT');

  constructor(private _authService: AuthService, private _router: Router) {}

  public logout(): void {
    this._authService.logout();
  }
}
