import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'forms-demo',
    loadComponent: () =>
      import('./shared/forms/examples/form-examples.component')
        .then(m => m.FormExamplesComponent)
  },
  {
    path: 'pagination-demo',
    loadComponent: () =>
      import('./shared/pagination/pagination-demo/pagination-demo.component')
        .then(m => m.PaginationDemoComponent)
  },
  {
    path: 'real-pagination-demo',
    loadComponent: () =>
      import('./shared/pagination/real-pagination/real-pagination.component')
        .then(m => m.RealPaginationComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];