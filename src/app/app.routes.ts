import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { Layout } from './pages/layout/layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
        canActivate: [authGuard],
      },
      {
        path: 'trial',
        loadComponent: () => import('./pages/trial-page/trial-page').then((m) => m.TrialPage),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'discover-premium',
    loadComponent: () =>
      import('./pages/discover-premium/discover-premium').then((m) => m.DiscoverPremium),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
    canActivate: [authGuard],
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/register-page/register-page').then((m) => m.RegisterPage),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
