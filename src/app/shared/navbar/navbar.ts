import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail();
  }

  logout(): void {
    this.authService.clearToken();
    this.userEmail = null;
    this.router.navigate(['/auth/login']);
  }
}