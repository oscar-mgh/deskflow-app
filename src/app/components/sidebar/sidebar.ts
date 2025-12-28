import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styles: ``,
})
export class Sidebar {
  public userName = signal<string>('');
  public userHasTickets = signal<boolean>(false);

  constructor(private _authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName.set(this._authService.getUserInfo().fullName);
  }

  logout(): void {
    this._authService.clearToken();
    this.router.navigate(['/']);
  }
}
