import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideState, provideStore} from "@ngrx/store";
import {blogReducer} from "./state/reducers/blog.reducer";
import {provideEffects} from "@ngrx/effects";
import {BlogEffects} from "./state/effects/blog.effects";
import {provideHttpClient} from "@angular/common/http";
import {BLOGS_STATE_NAME} from "./shared/constants/state.constant";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        // enable ngrx store
        provideStore(),
        provideState({
            name: BLOGS_STATE_NAME,
            reducer: blogReducer,
        }),
        provideEffects([BlogEffects]),
        provideHttpClient(),
    ]
};
