import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import {
  BLOGS_STATE_NAME,
  PROFILE_STATE_NAME,
} from './shared/constants/state.constant';
import { blogReducer } from './blog/blog.reducer';
import { provideEffects } from '@ngrx/effects';
import { BlogEffects } from './blog/blog.effects';
import { profileReducer } from './profile/profile.reducer';
import { ProfileEffects } from './profile/profile.effects';
import { ProfileService } from './profile/profile.service';
import { BlogService } from './blog/blog.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: '',
    providers: [
      BlogService,
      provideState({
        name: BLOGS_STATE_NAME,
        reducer: blogReducer,
      }),
      provideEffects([BlogEffects]),
    ],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.routes').then((m) => m.HOME_ROUTES),
      },

      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.routes').then((m) => m.BLOG_ROUTES),
      },

      {
        path: 'discover',
        loadChildren: () =>
          import('./discover/discover.routes').then((m) => m.DISCOVER_ROUTES),
      },
    ],
  },

  {
    path: 'profile',
    providers: [
      ProfileService,
      provideState({
        name: PROFILE_STATE_NAME,
        reducer: profileReducer,
      }),
      provideEffects([ProfileEffects]),
    ],
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
];
