import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { Layout } from './pages/layout/layout';
import { roleGuard } from './guard/role.guard';

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
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/panel/panel').then((m) => m.Panel),
          },
          {
            path: 'tickets',
            loadComponent: () =>
              import('./pages/tickets-page/tickets-page').then((m) => m.TicketsPage),
          },
          {
            path: 'ticket-create',
            loadComponent: () =>
              import('./pages/ticket-page/ticket-page').then((m) => m.TicketPage),
          },
          {
            path: 'ticket/:ticketId',
            loadComponent: () =>
              import('./pages/ticket-page/ticket-page').then((m) => m.TicketPage),
          },
          {
            path: 'ticket/:ticketId/comments',
            loadComponent: () => import('./pages/comments-page/comments-page').then((m) => m.CommentsPage),
          },
          {
            path: 'reports',
            loadComponent: () =>
              import('./pages/report-page/report-page').then((m) => m.ReportPage),
            canActivate: [roleGuard],
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./pages/profile-page/profile-page').then((m) => m.ProfilePage),
          },
          {
            path: 'admin',
            loadComponent: () => import('./pages/admin-page/admin-page').then((m) => m.AdminPage),
            canActivate: [roleGuard],
          },
        ],
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'trial',
    loadComponent: () => import('./pages/trial-page/trial-page').then((m) => m.TrialPage),
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
