import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, of, withLatestFrom} from 'rxjs';
import {BlogService} from '../../services/blog.service';
import {select, Store} from "@ngrx/store";
import {selectBlogsInitialized} from "../selectors/blog.selector";
import {BlogActions, BlogApiActions} from "../actions/blog.action";

@Injectable()
export class BlogEffects {
  loadBlogs$ = createEffect(() => this.actions$.pipe(
    ofType(BlogActions.loadBlogs),
    // select Initialized info from store to determine whether to load blogs from backend api
    withLatestFrom(this.store.pipe(select(selectBlogsInitialized))),
    mergeMap((
      [_, isInitialized]
    ) => {
      if (isInitialized) {
        // already initialized, dispatch loaded success with null in blogs
        return of(BlogApiActions.blogsLoadedSuccess({blogs: null}));
      } else {
        // not initialized, load blogs from backend api
        return this.blogService.getBlogs().pipe(
          map(blogs => (BlogApiActions.blogsLoadedSuccess({blogs}))),
          catchError(() => of(BlogApiActions.blogsLoadedError()))
        );
      }
    })
  ));

  constructor(
    private actions$: Actions,
    private blogService: BlogService,
    private store: Store,
  ) {
  }
}
