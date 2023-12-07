import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideState, provideStore} from "@ngrx/store";
import {blogReducer} from "./state/reducers/blog.reducer";
import {provideEffects} from "@ngrx/effects";
import {BlogEffects} from "./state/effects/blog.effects";
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        // enable ngrx store
        provideStore(),
        provideState({
            name: 'blogs',
            reducer: blogReducer,
        }),
        provideEffects([BlogEffects]),
        provideHttpClient(),
    ]
};
