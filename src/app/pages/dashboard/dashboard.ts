import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { EmtpySpace } from '../../components/emtpy-space/emtpy-space';
import { InfoGrid } from '../../components/info-grid/info-grid';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [EmtpySpace, InfoGrid, Sidebar, RouterOutlet],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  public userName = signal<string>('');
  public userHasTickets = signal<boolean>(true);
  public creatingTicket = signal<boolean>(false);
  public consultingTicket = signal<boolean>(true);

  constructor(private _authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName.set(this._authService.getUserInfo().fullName);
  }

  logout(): void {
    this._authService.clearToken();
    this.router.navigate(['/']);
  }
}
