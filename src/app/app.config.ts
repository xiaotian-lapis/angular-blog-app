import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideState, provideStore} from "@ngrx/store";
import {blogReducer} from "./state/reducers/blog.reducer";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        // enable ngrx store
        provideStore(),
        provideState({
            name: 'blogs',
            reducer: blogReducer,
        })
    ]
};
