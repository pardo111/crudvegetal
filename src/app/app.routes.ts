import { Routes } from '@angular/router';
import { AppShell } from '@/layout/app-shell/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: '',
        loadComponent: () => import('@/components/vegetal-list/vegetal-list').then((module) => module.VegetalList),
        title: 'Registros | Verde Vivo',
      },
      {
        path: 'nuevo',
        loadComponent: () => import('@/components/vegetal-form/vegetal-form').then((module) => module.VegetalForm),
        title: 'Nuevo registro | Verde Vivo',
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('@/components/vegetal-form/vegetal-form').then((module) => module.VegetalForm),
        title: 'Editar registro | Verde Vivo',
      },
      {
        path: ':id',
        loadComponent: () => import('@/components/vegetal-detail/vegetal-detail').then((module) => module.VegetalDetail),
        title: 'Detalle | Verde Vivo',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
