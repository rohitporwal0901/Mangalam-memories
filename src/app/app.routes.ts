import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.Home),
    },
    {
        path: 'admin/login',
        loadComponent: () => import('./pages/admin-login/admin-login').then(m => m.AdminLogin),
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
        canActivate: [() => inject(AuthService).isLoggedIn()],
    },
    { path: '**', redirectTo: '' }
];
