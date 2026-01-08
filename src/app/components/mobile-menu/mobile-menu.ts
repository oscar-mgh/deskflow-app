import { Component, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/theme.service';

@Component({
  selector: 'mobile-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-menu.html',
})
export class MobileMenu {
  public sidebarOpen = false;

  public agentMenuItems = input.required<MenuItem[]>();
  public adminMenuItems = input.required<MenuItem[]>();
  public menuItems = input.required<MenuItem[]>();

  public userName = input.required<string>();
  public userRole = input.required<string>();
  public isAdmin = input.required<boolean>();
  public isAgent = input.required<boolean>();

  constructor(
    private _authService: AuthService,
    private _router: Router,
    public config: ConfigService
  ) {}

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  public logout(): void {
    this._authService.clearToken();
    this._router.navigate(['/']);
  }
}
