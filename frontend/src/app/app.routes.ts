import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'produtos', canActivate: [authGuard], loadComponent: () => import('./produtos/produtos.component').then(m => m.ProdutosComponent) },
  { path: 'pedidos', canActivate: [authGuard], loadComponent: () => import('./pedidos/pedidos.component').then(m => m.PedidosComponent) },
  { path: 'usuarios', canActivate: [authGuard], loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
