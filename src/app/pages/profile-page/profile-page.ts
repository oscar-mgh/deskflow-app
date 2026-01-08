import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { UserClaims } from '../../models/auth.model';
import { RolePipe } from '../../pipes/role.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RolePipe],
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  public userInfo = signal<UserClaims | undefined>(undefined);

  constructor(private _authService: AuthService) {
    this.userInfo.set(this._authService.getUserInfo());
  }
}
