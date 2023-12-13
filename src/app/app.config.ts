import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { blogReducer } from './state/reducers/blog.reducer';
import { provideEffects } from '@ngrx/effects';
import { BlogEffects } from './state/effects/blog.effects';
import { provideHttpClient } from '@angular/common/http';
import {
  BLOGS_STATE_NAME,
  PROFILE_STATE_NAME,
} from './shared/constants/state.constant';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimations } from '@angular/platform-browser/animations';
import { profileReducer } from './state/reducers/profile.reducer';
import { ProfileEffects } from './state/effects/profile.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // enable ngrx store
    provideStore(),
    provideState({
      name: BLOGS_STATE_NAME,
      reducer: blogReducer,
    }),
    provideState({
      name: PROFILE_STATE_NAME,
      reducer: profileReducer,
    }),
    provideEffects([BlogEffects, ProfileEffects]),
    provideHttpClient(),
    provideStoreDevtools({ maxAge: 25 }),
    provideAnimations(),
  ],
};
