import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { Store } from '@ngrx/store';
import { selectBlogsInitialized } from '../selectors/blog.selector';
import { BlogActions, BlogApiActions } from '../actions/blog.action';

@Injectable()
export class BlogEffects {
  loadBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadBlogs),
      // select Initialized info from store to determine whether to load blogs from backend api
      concatLatestFrom(() => this.store.select(selectBlogsInitialized)),
      mergeMap(([_, isInitialized]) => {
        if (isInitialized) {
          // already initialized, dispatch loaded success with null in blogs
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
