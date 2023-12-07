import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, EMPTY, map, mergeMap, of, withLatestFrom} from 'rxjs';
import { BlogService } from '../../services/blog.service';
import {select, Store} from "@ngrx/store";
import {selectBlogsInitialized} from "../selectors/blog.selector";

@Injectable()
export class BlogEffects {
    loadBlogs$ = createEffect(() => this.actions$.pipe(
        ofType('[Blog] Load Blogs'),
        // check whether is already initialized
        withLatestFrom(this.store.pipe(select(selectBlogsInitialized))),
        mergeMap((
            [action, isInitialized]: [any, boolean]
        ) => {
            if (isInitialized) {
                // already initialized, dispatch loaded success with null in blogs
                return of({type: '[Blog API] Blogs Loaded Success', blogs: null});
            } else {
                // not initialized, load blogs from backend api
                return this.blogService.getBlogs().pipe(
                    map(blogs => ({type: '[Blog API] Blogs Loaded Success', blogs})),
                    catchError(() => of({type: '[Blog API] Blogs Loaded Error'}))
                );
            }
        })
    ));

    constructor(
        private actions$: Actions,
        private blogService: BlogService,
        private store: Store,
    ) {}
}
