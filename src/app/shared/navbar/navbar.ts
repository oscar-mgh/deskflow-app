import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  userEmail = signal<string>('');
  showUserButton = signal<boolean>(false);

  constructor(private _authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userEmail.set(this._authService.getUserEmail());
    this.showUserButton.set(this.router.url.startsWith('/tickets/') || this.router.url === '/dashboard');
  }

  logout(): void {
    this._authService.clearToken();
    this.userEmail.set('');
    this.router.navigate(['/']);
  }
}
