import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'trial',
        loadComponent: () => import('./pages/trial-page/trial-page').then((m) => m.TrialPage),
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
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
