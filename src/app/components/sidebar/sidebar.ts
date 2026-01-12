import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  providers: [ConfigService],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  public agentMenuItems = input.required<MenuItem[]>();
  public adminMenuItems = input.required<MenuItem[]>();
  public menuItems = input.required<MenuItem[]>();

  public userName = input.required<string>();
  public userRole = input.required<string>();
  public isAdmin = input.required<boolean>();
  public isAgent = input.required<boolean>();

  constructor(private _authService: AuthService, public config: ConfigService) {}

  public logout(): void {
    this._authService.logout();
  }
}
