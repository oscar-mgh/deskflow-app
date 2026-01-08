import { Component, computed, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.html',
})
export class AdminPage {
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAdmin = computed<boolean>(() => this.userRole() === 'ADMIN');
  public loading = signal(false);

  constructor(private _authService: AuthService) {}

  public systemStats = signal([
    { label: 'Usuarios Totales', val: '1,284', icon: 'bi-people', color: 'text-primary' },
    { label: 'Tiempo de Respuesta', val: '22m', icon: 'bi-clock-history', color: 'text-success' },
    { label: 'Carga del Servidor', val: '14%', icon: 'bi-cpu', color: 'text-info' },
    { label: 'Ingresos Mensuales', val: '$22.4k', icon: 'bi-cash-stack', color: 'text-amber-500' },
  ]);

  public activeAgents = signal([
    { name: 'Juan Pérez', role: 'Soporte N2', load: 85, status: 'Online' },
    { name: 'María García', role: 'Soporte N1', load: 40, status: 'Online' },
    { name: 'Ricardo Soto', role: 'Soporte N1', load: 10, status: 'Away' },
  ]);
}
