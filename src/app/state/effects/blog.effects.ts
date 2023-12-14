import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { Store } from '@ngrx/store';
import { BlogActions, BlogApiActions } from '../actions/blog.action';
import {selectBlogsViewStatus} from "../selectors/blog.selector";
import {ViewStatus} from "../../shared/constants/status.constant";

@Injectable()
export class BlogEffects {
  loadBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadBlogs),
      // select Initialized info from store to determine whether to load blogs from backend api
      concatLatestFrom(() => this.store.select(selectBlogsViewStatus)),
      mergeMap(([_, viewStatus]) => {
        if (viewStatus === ViewStatus.Reloading) {
          // already initialized, don't load blogs from backend api
          return of(BlogApiActions.blogsLoadedSuccess({ blogs: null }));
        } else {
          // not initialized, load blogs from backend api
          return this.blogService.getBlogs().pipe(
            map(blogs => BlogApiActions.blogsLoadedSuccess({ blogs })),
            catchError((error: { message: string }) =>
              of(BlogApiActions.blogsLoadedError({ error }))
            )
          );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private blogService: BlogService,
    private store: Store
  ) {}
}
