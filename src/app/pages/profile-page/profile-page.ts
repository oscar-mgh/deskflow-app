import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RolePipe } from '../../pipes/role.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RolePipe],
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private _authService = inject(AuthService);

  userInfo = signal(this._authService.getUserInfo());
}
