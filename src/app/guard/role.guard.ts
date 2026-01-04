import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = authService.getUserInfo();

  const isAdminRoute = state.url.includes('/admin');

  const allowedRoles = isAdminRoute ? ['ADMIN'] : ['ADMIN', 'AGENT'];

  if (allowedRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
