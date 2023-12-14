import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},

  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home-routing.module').then(m => m.HomeRoutingModule),
  },

  {
    path: 'blog/:id',
    loadChildren: () =>
      import('./components/blog-content/blog-content-routing.module').then(
        m => m.BlogContentRoutingModule
      ),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile-routing.module').then(
        m => m.ProfileRoutingModule
      ),
  },

  {
    path: 'edit-blog',
    loadChildren: () =>
      import('./components/blog-edit/blog-edit-routing.module').then(
        m => m.BlogEditRoutingModule
      ),
  },

  {
    path: 'create-blog',
    loadChildren: () =>
      import('./components/blog-edit/blog-edit-routing.module').then(
        m => m.BlogEditRoutingModule
      ),
  },

  {
    path: 'discover',
    loadChildren: () =>
      import('./pages/discover/discover-routing.module').then(
        m => m.DiscoverRoutingModule
      ),
  },
];
