import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLoggedIn = authService.isLoggedIn();
  const isAuthRoute = state.url.startsWith('/auth');

  if (isLoggedIn) {
    if (isAuthRoute) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  if (isAuthRoute) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
