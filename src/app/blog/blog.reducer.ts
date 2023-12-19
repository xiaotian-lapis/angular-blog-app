import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { IBlog } from '../shared/models/blog.model';
import * as BlogActions from './blog.action';
import { ViewStatus } from '../shared/constants/status.constant';
import { equals, isNil } from '../shared/utils/ramda-functions.util';

export interface IBlogState extends EntityState<IBlog> {
  error: any;
  viewStatus: ViewStatus;
}

export const adapter: EntityAdapter<IBlog> = createEntityAdapter<IBlog>();

export const initialState: IBlogState = adapter.getInitialState({
  error: null,
  viewStatus: ViewStatus.Initial,
});

export const blogReducer = createReducer(
  initialState,
  on(BlogActions.loadBlogs, (state) => {
    console.log('loadBlogs action triggered');
    if (equals(state.viewStatus, ViewStatus.Initial)) {
      return { ...state, viewStatus: ViewStatus.Loading };
    } else {
      // if already initialized, just set view status to reloading,
      // and prevent loading blog from backend api
      return { ...state, viewStatus: ViewStatus.Reloading };
    }
  }),
  on(
    BlogActions.addBlog,
    (
      state,
      { id, author, title, description, content, createdTime, location },
    ) => {
      console.log('addBlog reducer triggered');
      console.log(state.entities);
      const newBlog: IBlog = {
        id,
        author,
        title,
        description,
        content,
        createdTime,
        updatedTime: createdTime,
        location: location,
      };
      return adapter.addOne(newBlog, state);
    },
  ),
  on(
    BlogActions.updateBlog,
    (
      state,
      { id, author, title, description, content, updatedTime, location },
    ) => {
      console.log('updateBlog reducer triggered');
      console.log(state.entities);
      const changes = {
        author,
        title,
        description,
        content,
        updatedTime,
        location,
      };
      return adapter.updateOne({ id, changes }, state);
    },
  ),
  on(BlogActions.removeBlog, (state, { id }) => {
    console.log('removeBlog reducer triggered');
    console.log(state.entities);
    return adapter.removeOne(id, state);
  }),
  on(BlogActions.blogsLoadedSuccess, (state, { blogs }) => {
    if (isNil(blogs)) {
      // if incoming blog is null, just set loading state to false.
      console.log('blogsLoadedSuccess reducer triggered, and blog is null');
      return { ...state, viewStatus: ViewStatus.Success };
    }
    console.log('blogsLoadedSuccess reducer triggered');
    console.log(state.entities);
    return adapter.setAll(blogs, {
      ...state,
      viewStatus: ViewStatus.Success,
    });
  }),
  on(BlogActions.blogsLoadedError, (state, { error }) => {
    console.log('blogsLoadedError reducer triggered');
    console.log(state.entities);
    return { ...state, error: error.message, viewStatus: ViewStatus.Failure };
  }),
);
