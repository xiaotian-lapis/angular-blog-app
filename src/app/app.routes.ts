import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then((m) => m.HOME_ROUTES),
  },

  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.routes').then((m) => m.BLOG_ROUTES),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },

  {
    path: 'discover',
    loadChildren: () =>
      import('./discover/discover.routes').then((m) => m.DISCOVER_ROUTES),
  },
];
