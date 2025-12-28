import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLoggedIn = authService.isLoggedIn();
  const isAuthRoute = state.url.startsWith('/auth');
  const isHomeRoute = state.url === '/' || state.url === '';

  if (isLoggedIn) {
    if (isAuthRoute || isHomeRoute) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  if (isAuthRoute || isHomeRoute) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
