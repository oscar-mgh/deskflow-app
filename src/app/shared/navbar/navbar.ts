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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userEmail.set(this.authService.getUserEmail());
    this.showUserButton.set(this.router.url.startsWith('/tickets/'));
  }

  logout(): void {
    this.authService.clearToken();
    this.userEmail.set('');
    this.router.navigate(['/']);
  }
}
